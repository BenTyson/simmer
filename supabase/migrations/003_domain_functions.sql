-- Domain statistics helper functions
-- Used by the scraping cron job to track success/failure rates

-- Increment successful scrape count for a domain
CREATE OR REPLACE FUNCTION increment_domain_success(domain_name TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE scrape_domains
    SET
        successful_scrapes = successful_scrapes + 1,
        total_recipes = total_recipes + 1,
        last_scraped_at = NOW()
    WHERE domain = domain_name;

    -- If domain doesn't exist, create it
    IF NOT FOUND THEN
        INSERT INTO scrape_domains (domain, successful_scrapes, total_recipes, last_scraped_at)
        VALUES (domain_name, 1, 1, NOW())
        ON CONFLICT (domain) DO UPDATE SET
            successful_scrapes = scrape_domains.successful_scrapes + 1,
            total_recipes = scrape_domains.total_recipes + 1,
            last_scraped_at = NOW();
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Increment failed scrape count for a domain
CREATE OR REPLACE FUNCTION increment_domain_failure(domain_name TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE scrape_domains
    SET
        failed_scrapes = failed_scrapes + 1,
        last_scraped_at = NOW()
    WHERE domain = domain_name;

    -- If domain doesn't exist, create it
    IF NOT FOUND THEN
        INSERT INTO scrape_domains (domain, failed_scrapes, last_scraped_at)
        VALUES (domain_name, 1, NOW())
        ON CONFLICT (domain) DO UPDATE SET
            failed_scrapes = scrape_domains.failed_scrapes + 1,
            last_scraped_at = NOW();
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Get queue stats by domain
CREATE OR REPLACE FUNCTION get_queue_stats()
RETURNS TABLE (
    domain VARCHAR(255),
    pending_count BIGINT,
    processing_count BIGINT,
    completed_count BIGINT,
    failed_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        sq.domain,
        COUNT(*) FILTER (WHERE sq.status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE sq.status = 'processing') as processing_count,
        COUNT(*) FILTER (WHERE sq.status = 'completed') as completed_count,
        COUNT(*) FILTER (WHERE sq.status = 'failed') as failed_count
    FROM scrape_queue sq
    GROUP BY sq.domain
    ORDER BY pending_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Reset stuck "processing" items back to pending (for crashed jobs)
CREATE OR REPLACE FUNCTION reset_stuck_queue_items(older_than_minutes INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE scrape_queue
    SET status = 'pending'
    WHERE status = 'processing'
    AND updated_at < NOW() - (older_than_minutes || ' minutes')::INTERVAL;

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;
