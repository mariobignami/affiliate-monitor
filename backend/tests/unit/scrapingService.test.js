const { extractPrice, extractDiscount } = require('../../src/services/scrapingService');

describe('Scraping Service', () => {
  describe('extractPrice', () => {
    test('should extract price with R$ symbol', () => {
      const text = 'Produto por R$ 99,90 apenas hoje';
      expect(extractPrice(text)).toBe(99.90);
    });

    test('should extract price without symbol', () => {
      const text = 'Preço: 150.50 reais';
      expect(extractPrice(text)).toBe(150.50);
    });

    test('should handle price with comma as decimal separator', () => {
      const text = 'De R$ 200,00 por apenas R$ 150,99';
      expect(extractPrice(text)).toBe(200.00);
    });

    test('should return null if no price found', () => {
      const text = 'No price here';
      expect(extractPrice(text)).toBeNull();
    });

    test('should return null for empty text', () => {
      expect(extractPrice('')).toBeNull();
      expect(extractPrice(null)).toBeNull();
    });
  });

  describe('extractDiscount', () => {
    test('should extract discount percentage with off', () => {
      const text = 'Save 50% off today!';
      expect(extractDiscount(text)).toBe(50);
    });

    test('should extract discount in Portuguese', () => {
      const text = 'Desconto de 30% hoje';
      expect(extractDiscount(text)).toBe(30);
    });

    test('should extract discount with desconto keyword', () => {
      const text = '40% desconto especial';
      expect(extractDiscount(text)).toBe(40);
    });

    test('should return null if no discount found', () => {
      const text = 'No discount here';
      expect(extractDiscount(text)).toBeNull();
    });

    test('should return null for empty text', () => {
      expect(extractDiscount('')).toBeNull();
      expect(extractDiscount(null)).toBeNull();
    });
  });
});
