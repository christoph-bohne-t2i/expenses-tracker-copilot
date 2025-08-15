export type Category = { id: string; name: string };

export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId?: string | null;
  category?: Category | null;
};
