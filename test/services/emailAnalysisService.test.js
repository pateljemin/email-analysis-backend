const { findRepeatedParagraphSortedByCount } = require('../../src/services/emailAnalysisService'); // Update the path accordingly

describe('findRepeatedParagraphSortedByCount', () => {
    it('should find repeated paragraphs and return them in descending order by count', () => {
        const emails = [
            "This is a paragraph.",
            "Another paragraph.",
            "This is a paragraph.", // Repeated
            "Yet another paragraph.",
            "This is a paragraph.", // Repeated
            "Different paragraph.",
        ];

        const threshold = 0.5;

        const result = findRepeatedParagraphSortedByCount(emails, threshold, 1);

        expect(result.isSuccess).toBe(true);
        expect(result.snippets).toEqual([
            "This is a paragraph.",
        ]);
    });

    it('should handle no repeated paragraphs and return empty array', () => {
        const emails = [
            "This is a paragraph.",
            "Another paragraph.",
            "Yet another paragraph.",
            "Different paragraph.",
        ];

        const threshold = 1;

        const result = findRepeatedParagraphSortedByCount(emails, threshold, 1);

        expect(result.isSuccess).toBe(true);
        expect(result.snippets).toEqual([]);
    });
});