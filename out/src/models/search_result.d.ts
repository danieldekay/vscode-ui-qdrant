/**
 * Individual search result containing vector data and metadata.
 */
export interface SearchResultItem {
    /** Unique identifier of the vector in Qdrant */
    id: string;
    /** Similarity score (0.0 to 1.0) */
    score: number;
    /** Associated metadata/payload data */
    payload: Record<string, any>;
    /** Vector data (optional, only included if requested) */
    vector?: number[];
}
/**
 * Validation rules for SearchResultItem
 */
export declare function validateSearchResultItem(item: SearchResultItem): boolean;
//# sourceMappingURL=search_result.d.ts.map