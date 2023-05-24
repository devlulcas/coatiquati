export type PaginationInputDTO = {
	limit: number;
	page: number;
};

export class Pagination {
	private constructor(private readonly limitValue: number, private readonly offsetValue: number) {}

  get limit(): number {
    return this.limitValue;
  }
  
  get offset(): number {
    return this.offsetValue;
  }

	static create(limit: number, page: number): Pagination {
		const offset = (page - 1) * limit;

		return new Pagination(limit, offset);
	}
}
