import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Good } from '../../interface/good';
import { Category } from '../../interface/category';
import { GoodsService } from '../../services/goods.service';
import { CategoryService } from '../../services/category.service';
import { FeedbackService } from '../../core/errors/feedback.service';

@Component({ selector: 'app-admin', templateUrl: './admin.component.html', styleUrls: ['./admin.component.scss'] })
export class AdminComponent implements OnInit, OnDestroy {
  @ViewChild('image') image: ElementRef<HTMLInputElement>;
  @ViewChild('editImage') editImage: ElementRef<HTMLInputElement>;
  @ViewChild('dt') table: Table;
  product: Good[] = [];
  editProduct: Good = {};
  selectedProduct: Good[] = [];
  Categorys: Category[] = [];
  selectedCategory: Category;
  uploadedFiles: File[] = [];
  loading = true;
  saving = false;
  productDialog = false;
  editDialog = false;
  AddCategorydisplay = false;
  submitted = false;
  categorys = ['Men\'s Fashion', 'Women\'s Fashion', 'Kid\'s Fashion', 'Sports & Fitness', 'Bags', 'main-slider']
    .map(value => ({ label: value, name: value, value }));
  statuses = ['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'].map(value => ({ label: value, value }));
  private originalCategory: string;
  private readonly destroyed$ = new Subject<void>();
  private productsSubscription: Subscription;

  constructor(private gs: GoodsService, private cgs: CategoryService,
              private config: PrimeNGConfig, private confirmation: ConfirmationService,
              private feedback: FeedbackService) {}

  ngOnInit(): void {
    this.gitCategory('Men\'s Fashion');
    this.cgs.gitAllCategory().pipe(takeUntil(this.destroyed$)).subscribe({
      next: categories => this.Categorys = categories,
      error: () => this.feedback.error('Unable to load categories.')
    });
    this.config.ripple = true;
  }
  gitCategory(category: string): void {
    if (this.productsSubscription) { this.productsSubscription.unsubscribe(); }
    this.loading = true;
    this.productsSubscription = this.gs.gitCategory(category).pipe(takeUntil(this.destroyed$)).subscribe({
      next: products => { this.product = products; this.loading = false; },
      error: () => { this.loading = false; this.feedback.error('Unable to load products.'); }
    });
  }
  async addNewGood(form: NgForm): Promise<void> {
    if (form.invalid || this.saving) { return; }
    const data: Good = form.value;
    this.saving = true;
    try {
      await this.gs.addNewGood(data.name, data.price, data.description, this.image.nativeElement.files[0],
        data.country, data.status, data.date, data.category);
      this.productDialog = false;
      form.resetForm();
      this.feedback.success('Product created.');
    } catch { this.feedback.error('Product was not created. Check the fields, image and your administrator access.'); }
    finally { this.saving = false; }
  }
  async AddNewCategory(form: NgForm): Promise<void> {
    if (form.invalid || this.saving) { return; }
    this.saving = true;
    try {
      await this.cgs.AddCategory(form.value.name, form.value.description, this.uploadedFiles[0]);
      this.uploadedFiles = [];
      form.resetForm();
      this.AddCategorydisplay = false;
      this.feedback.success('Category created.');
    } catch { this.feedback.error('Category was not created. Check the name, image and your administrator access.'); }
    finally { this.saving = false; }
  }
  async update(form: NgForm): Promise<void> {
    if (form.invalid || this.saving) { return; }
    const data: Good = form.value;
    if (data.category !== this.originalCategory) {
      this.feedback.error('Moving products between categories requires a separate migration. Keep the original category.');
      return;
    }
    this.saving = true;
    try {
      await this.gs.update(this.editProduct.id, data.name, data.price, data.description, this.editImage.nativeElement.files[0],
        data.country, data.status, data.date, this.originalCategory);
      this.editDialog = false;
      this.feedback.success('Product updated.');
    } catch { this.feedback.error('Product was not updated. Please check the fields and try again.'); }
    finally { this.saving = false; }
  }
  deleteProduct(product: Good): void {
    this.confirmation.confirm({ message: 'Delete ' + product.name + '?', header: 'Confirm', icon: 'pi pi-exclamation-triangle',
      accept: () => this.gs.deleteitem(product.category, product.id)
        .then(() => this.feedback.success('Product deleted.')).catch(() => this.feedback.error('Product was not deleted.'))
    });
  }
  updateDialog(product: Good): void {
    this.editProduct = { ...product };
    this.originalCategory = product.category;
    this.editDialog = true;
  }
  onSelectImage(files: File[]): void { this.uploadedFiles = files.slice(0, 1); }
  onRowSelect(event: { data: Category }): void { this.gitCategory(event.data.name); }
  onRepresentativeChange(event: { value: string[] }): void { this.table.filter(event.value, 'category', 'in'); }
  onActivityChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (Number.isFinite(value)) { this.table.filter(value, 'activity', 'gte'); }
  }
  onDateSelect(date: Date): void { this.table.filter(date, 'date', 'equals'); }
  openNew(): void { this.productDialog = true; }
  hideDialog(): void { this.productDialog = false; this.editDialog = false; }
  AddCategoryDialog(): void { this.AddCategorydisplay = true; }
  ngOnDestroy(): void { this.destroyed$.next(); this.destroyed$.complete(); }
}
