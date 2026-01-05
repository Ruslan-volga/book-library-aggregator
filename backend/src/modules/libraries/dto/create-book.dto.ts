export class CreateBookDto {
  libraryId: number;
  title: string;
  author: string;
  year?: number;
  description?: string;
  isAvailable: boolean;
  totalCopies: number;
  availableCopies: number;
}
