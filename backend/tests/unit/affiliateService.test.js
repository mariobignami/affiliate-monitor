const { detectPlatform, convertAffiliateLink, generateUrlHash } = require('../../src/services/affiliateService');

describe('Affiliate Service', () => {
  describe('detectPlatform', () => {
    test('should detect Amazon platform', () => {
      const url = 'https://www.amazon.com/product/dp/B08N5WRWNW';
      expect(detectPlatform(url)).toBe('amazon');
    });

    test('should detect Shopee platform', () => {
      const url = 'https://shopee.com.br/product/12345';
      expect(detectPlatform(url)).toBe('shopee');
    });

    test('should detect Mercado Livre platform', () => {
      const url = 'https://produto.mercadolivre.com.br/MLB-12345';
      expect(detectPlatform(url)).toBe('mercadolivre');
    });

    test('should return unknown for unrecognized platforms', () => {
      const url = 'https://example.com/product';
      expect(detectPlatform(url)).toBe('unknown');
    });
  });

  describe('convertAffiliateLink', () => {
    test('should convert Amazon link with affiliate ID', () => {
      const url = 'https://www.amazon.com/product/dp/B08N5WRWNW';
      const affiliateIds = { amazon: 'myaffiliate-20' };
      const converted = convertAffiliateLink(url, affiliateIds);
      
      expect(converted).toContain('tag=myaffiliate-20');
    });

    test('should convert Shopee link with affiliate ID', () => {
      const url = 'https://shopee.com.br/product/12345';
      const affiliateIds = { shopee: 'myshopee123' };
      const converted = convertAffiliateLink(url, affiliateIds);
      
      expect(converted).toContain('af_siteid=myshopee123');
    });

    test('should return original URL if no affiliate ID provided', () => {
      const url = 'https://www.amazon.com/product/dp/B08N5WRWNW';
      const affiliateIds = {};
      const converted = convertAffiliateLink(url, affiliateIds);
      
      expect(converted).toBe(url);
    });

    test('should return original URL for unknown platforms', () => {
      const url = 'https://example.com/product';
      const affiliateIds = { amazon: 'test' };
      const converted = convertAffiliateLink(url, affiliateIds);
      
      expect(converted).toBe(url);
    });
  });

  describe('generateUrlHash', () => {
    test('should generate consistent hash for same URL', () => {
      const url = 'https://example.com/product';
      const hash1 = generateUrlHash(url);
      const hash2 = generateUrlHash(url);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 hash length
    });

    test('should generate different hashes for different URLs', () => {
      const url1 = 'https://example.com/product1';
      const url2 = 'https://example.com/product2';
      const hash1 = generateUrlHash(url1);
      const hash2 = generateUrlHash(url2);
      
      expect(hash1).not.toBe(hash2);
    });
  });
});
