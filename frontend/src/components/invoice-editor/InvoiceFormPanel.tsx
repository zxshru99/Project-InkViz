"use client"

import { useState, useRef, useEffect } from 'react';
import { useInvoice, LineItem } from './InvoiceContext';
import { useProducts, Product } from '@/lib/products-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Trash2, Plus, Settings2, Search, Package, Briefcase, Boxes, Sparkles } from 'lucide-react';

const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case 'INR': return '₹';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'AED': return 'AED ';
    case 'CAD': return 'CA$';
    case 'AUD': return 'A$';
    case 'SGD': return 'S$';
    case 'JPY': return '¥';
    case 'USD':
    default: return '$';
  }
};

export function InvoiceFormPanel() {
  const { data, updateData, updateItem, addItem, removeItem } = useInvoice();
  const { products } = useProducts();
  const [activeAutocompleteId, setActiveAutocompleteId] = useState<string | null>(null);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');

  const handleSelectProduct = (itemId: string, product: Product) => {
    updateItem(itemId, {
      description: product.name,
      rate: product.sellingPrice,
      unit: product.unit,
      hsnCode: product.hsnSac,
    });
    if (product.taxRate > 0 && data.taxRate === 0 && data.cgstRate === 0 && data.igstRate === 0) {
      updateData({ taxRate: product.taxRate });
    }
    setActiveAutocompleteId(null);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="flex overflow-x-auto scrollbar-none w-full justify-start p-1.5 bg-muted/60 rounded-2xl gap-1 mb-4 touch-scroll">
          <TabsTrigger value="details" className="rounded-xl text-xs px-3.5 py-2 shrink-0 data-[state=active]:bg-card data-[state=active]:shadow-xs">Details</TabsTrigger>
          <TabsTrigger value="items" className="rounded-xl text-xs px-3.5 py-2 shrink-0 data-[state=active]:bg-card data-[state=active]:shadow-xs">Items ({data.items.length})</TabsTrigger>
          <TabsTrigger value="taxes" className="rounded-xl text-xs px-3.5 py-2 shrink-0 data-[state=active]:bg-card data-[state=active]:shadow-xs">Taxes & Fees</TabsTrigger>
          <TabsTrigger value="banking" className="rounded-xl text-xs px-3.5 py-2 shrink-0 data-[state=active]:bg-card data-[state=active]:shadow-xs">Banking</TabsTrigger>
          <TabsTrigger value="design" className="rounded-xl text-xs px-3.5 py-2 shrink-0 data-[state=active]:bg-card data-[state=active]:shadow-xs">Design & Theme</TabsTrigger>
          <TabsTrigger value="notes" className="rounded-xl text-xs px-3.5 py-2 shrink-0 data-[state=active]:bg-card data-[state=active]:shadow-xs">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card className="rounded-2xl border shadow-xs">
            <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="space-y-2">
                  <Label>Invoice Type</Label>
                  <Select value={data.documentType} onValueChange={(val: any) => updateData({ documentType: val })}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoice">Standard Invoice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={data.currency} onValueChange={(val: any) => updateData({ currency: val })}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($ - US Dollar)</SelectItem>
                      <SelectItem value="EUR">EUR (€ - Euro)</SelectItem>
                      <SelectItem value="GBP">GBP (£ - British Pound)</SelectItem>
                      <SelectItem value="INR">INR (₹ - Indian Rupee)</SelectItem>
                      <SelectItem value="AED">AED (د.إ - UAE Dirham)</SelectItem>
                      <SelectItem value="CAD">CAD (CA$ - Canadian Dollar)</SelectItem>
                      <SelectItem value="AUD">AUD (A$ - Australian Dollar)</SelectItem>
                      <SelectItem value="SGD">SGD (S$ - Singapore Dollar)</SelectItem>
                      <SelectItem value="JPY">JPY (¥ - Japanese Yen)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Invoice Number</Label>
                  <Input className="rounded-xl" value={data.invoiceNumber} onChange={(e) => updateData({ invoiceNumber: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>PO Number</Label>
                  <Input className="rounded-xl" value={data.poNumber} onChange={(e) => updateData({ poNumber: e.target.value })} placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input className="rounded-xl" type="date" value={data.issueDate} onChange={(e) => updateData({ issueDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input className="rounded-xl" type="date" value={data.dueDate} onChange={(e) => updateData({ dueDate: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border shadow-xs">
            <CardHeader><CardTitle>Parties</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-primary">Bill From</h3>
                <div className="grid gap-3">
                  <Input className="rounded-xl" placeholder="Company Name" value={data.billFrom.name} onChange={(e) => updateData({ billFrom: { ...data.billFrom, name: e.target.value } })} />
                  <Input className="rounded-xl" placeholder="Email Address" type="email" value={data.billFrom.email} onChange={(e) => updateData({ billFrom: { ...data.billFrom, email: e.target.value } })} />
                  <Textarea className="rounded-xl" placeholder="Physical Address" value={data.billFrom.address} onChange={(e) => updateData({ billFrom: { ...data.billFrom, address: e.target.value } })} />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-primary">Bill To</h3>
                <div className="grid gap-3">
                  <Input className="rounded-xl" placeholder="Client Name" value={data.client.name} onChange={(e) => updateData({ client: { ...data.client, name: e.target.value } })} />
                  <Input className="rounded-xl" placeholder="Client Email" type="email" value={data.client.email} onChange={(e) => updateData({ client: { ...data.client, email: e.target.value } })} />
                  <Textarea className="rounded-xl" placeholder="Client Address" value={data.client.address} onChange={(e) => updateData({ client: { ...data.client, address: e.target.value } })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card className="rounded-2xl border shadow-xs">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3">
              <div>
                <CardTitle>Line Items</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Type to fuzzy-search your product catalog or select directly.
                </p>
              </div>
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={() => setIsCatalogModalOpen(true)}
                className="text-xs h-8 rounded-xl w-full sm:w-auto"
              >
                <Boxes className="w-3.5 h-3.5 mr-1.5 text-primary" />
                Browse Catalog ({products.length})
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.items.map((item) => {
                const query = item.description.trim().toLowerCase();
                const matchingProducts = products.filter(p => 
                  !query || 
                  p.name.toLowerCase().includes(query) || 
                  p.sku.toLowerCase().includes(query) || 
                  p.hsnSac.toLowerCase().includes(query)
                ).slice(0, 5);

                const isAutocompleteOpen = activeAutocompleteId === item.id && matchingProducts.length > 0;

                return (
                  <div key={item.id} className="border p-3.5 sm:p-4 rounded-xl bg-card/60 space-y-3 relative group shadow-xs">
                    {/* Top: Description + Delete button */}
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-1.5 relative">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Description / Product</Label>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-primary" />
                            Catalog Autocomplete
                          </span>
                        </div>

                        {/* Autocomplete Input Container */}
                        <div className="relative">
                          <Input 
                            value={item.description} 
                            onChange={(e) => {
                              updateItem(item.id, { description: e.target.value });
                              setActiveAutocompleteId(item.id);
                            }} 
                            onFocus={() => setActiveAutocompleteId(item.id)}
                            onBlur={() => {
                              setTimeout(() => {
                                setActiveAutocompleteId((current) => (current === item.id ? null : current));
                              }, 200);
                            }}
                            placeholder="Type product name (e.g. Design, Hosting, Product...)" 
                            className="rounded-xl"
                          />

                          {/* Dropdown Popover */}
                          {isAutocompleteOpen && (
                            <div 
                              className="absolute left-0 right-0 top-full mt-1 bg-popover text-popover-foreground border shadow-xl rounded-xl z-50 overflow-hidden divide-y"
                              onMouseDown={(e) => e.preventDefault()}
                            >
                              <div className="p-1.5 bg-muted/50 text-[11px] font-medium text-muted-foreground flex items-center justify-between">
                                <span>Matching Catalog Items</span>
                                <span className="text-[10px]">Click to auto-fill</span>
                              </div>
                              <div className="max-h-48 overflow-y-auto touch-scroll">
                                {matchingProducts.map((prod) => (
                                  <button
                                    key={prod.id}
                                    type="button"
                                    onClick={() => handleSelectProduct(item.id, prod)}
                                    className="w-full text-left p-2.5 hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-between text-xs group/item"
                                  >
                                    <div className="min-w-0 pr-2">
                                      <div className="font-semibold truncate group-hover/item:text-primary">
                                        {prod.name}
                                      </div>
                                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                                        {prod.sku && <span className="font-mono bg-muted px-1 rounded">{prod.sku}</span>}
                                        {prod.hsnSac && <span>HSN: {prod.hsnSac}</span>}
                                        <Badge variant="outline" className="text-[9px] h-4 py-0">
                                          {prod.type}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <div className="font-bold text-foreground">
                                        {getCurrencySymbol(data.currency)}{prod.sellingPrice.toLocaleString()}
                                      </div>
                                      <div className="text-[10px] text-muted-foreground">
                                        / {prod.unit}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 p-0 text-destructive shrink-0 mt-5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity rounded-lg" 
                        onClick={() => removeItem(item.id)} 
                        disabled={data.items.length === 1}
                        aria-label="Delete line item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Middle: HSN/SAC + Unit */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">HSN/SAC</Label>
                        <Input 
                          className="h-8 text-xs font-mono rounded-lg" 
                          value={item.hsnCode} 
                          onChange={(e) => updateItem(item.id, { hsnCode: e.target.value })} 
                          placeholder="Code" 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Unit</Label>
                        <Select 
                          value={item.unit} 
                          onValueChange={(val: any) => updateItem(item.id, { unit: val })}
                        >
                          <SelectTrigger className="h-8 text-xs rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pcs">Pcs</SelectItem>
                            <SelectItem value="Hrs">Hrs</SelectItem>
                            <SelectItem value="Days">Days</SelectItem>
                            <SelectItem value="Kg">Kg</SelectItem>
                            <SelectItem value="Grams">Grams</SelectItem>
                            <SelectItem value="Boxes">Boxes</SelectItem>
                            <SelectItem value="Liters">Liters</SelectItem>
                            <SelectItem value="Meters">Meters</SelectItem>
                            <SelectItem value="Flat">Flat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Bottom: Qty, Rate, Discount, Amount */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-border/40 items-end">
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Qty</Label>
                        <Input 
                          type="number" 
                          min="1"
                          className="h-8 text-xs rounded-lg"
                          value={item.quantity} 
                          onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })} 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Rate ({getCurrencySymbol(data.currency)})</Label>
                        <Input 
                          type="number" 
                          className="h-8 text-xs rounded-lg"
                          value={item.rate} 
                          onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })} 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Discount ({getCurrencySymbol(data.currency)})</Label>
                        <Input 
                          className="h-8 text-xs rounded-lg" 
                          type="number" 
                          value={item.itemDiscount} 
                          onChange={(e) => updateItem(item.id, { itemDiscount: Number(e.target.value) })} 
                        />
                      </div>
                      <div className="space-y-1 text-right">
                        <Label className="text-[11px] text-muted-foreground">Total</Label>
                        <div className="h-8 flex items-center justify-end font-bold text-sm font-heading text-foreground">
                          {getCurrencySymbol(data.currency)} {(item.amount - (Number(item.itemDiscount)||0)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" /> Add Blank Item
                </Button>
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={() => setIsCatalogModalOpen(true)}
                  className="rounded-xl"
                >
                  <Boxes className="w-4 h-4 mr-2 text-primary" /> Select From Catalog
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Catalog Picker Dialog Modal */}
          <Dialog open={isCatalogModalOpen} onOpenChange={setIsCatalogModalOpen}>
            <DialogContent className="max-w-3xl max-h-[85vh] w-[95vw] overflow-y-auto rounded-2xl touch-scroll">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Product & Service Catalog
                </DialogTitle>
                <DialogDescription>
                  Select any item to insert it directly into this invoice.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name, SKU, or category..." 
                    className="pl-9 rounded-xl"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                  />
                </div>

                <div className="divide-y max-h-[50vh] overflow-y-auto border rounded-xl touch-scroll">
                  {products
                    .filter(p => 
                      !catalogSearch || 
                      p.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                      p.sku.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                      p.description.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                      p.type.toLowerCase().includes(catalogSearch.toLowerCase())
                    )
                    .map(prod => (
                      <div key={prod.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/40 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{prod.name}</span>
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {prod.type}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 sm:gap-3">
                            {prod.sku && <span>SKU: {prod.sku}</span>}
                            {prod.hsnSac && <span>HSN: {prod.hsnSac}</span>}
                            <span>Type: {prod.type}</span>
                            {prod.taxRate > 0 && <span className="text-emerald-600 font-medium">Tax: {prod.taxRate}%</span>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          <div className="text-left sm:text-right">
                            <div className="text-base font-bold text-foreground">
                              {getCurrencySymbol(data.currency)}{prod.sellingPrice.toLocaleString()}
                              <span className="text-xs text-muted-foreground font-normal"> / {prod.unit}</span>
                            </div>
                          </div>
                          <Button 
                            type="button"
                            size="sm" 
                            className="h-8 text-xs rounded-xl"
                            onClick={() => {
                              const firstItem = data.items[0];
                              const isFirstBlank = data.items.length === 1 && !firstItem.description && firstItem.rate === 0;

                              if (isFirstBlank) {
                                handleSelectProduct(firstItem.id, prod);
                              } else {
                                const newItemId = Math.random().toString(36).substr(2, 9);
                                const updates: any = {
                                  items: [
                                    ...data.items,
                                    {
                                      id: newItemId,
                                      description: prod.name,
                                      quantity: 1,
                                      rate: prod.sellingPrice,
                                      amount: prod.sellingPrice,
                                      hsnCode: prod.hsnSac,
                                      unit: prod.unit,
                                      itemDiscount: 0
                                    }
                                  ]
                                };
                                if (prod.taxRate > 0 && data.taxRate === 0 && data.cgstRate === 0 && data.igstRate === 0) {
                                  updates.taxRate = prod.taxRate;
                                }
                                updateData(updates);
                              }
                              setIsCatalogModalOpen(false);
                            }}
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Insert
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Card className="rounded-2xl border shadow-xs">
            <CardHeader><CardTitle>Global Discount</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select value={data.discountType} onValueChange={(val: 'percentage'|'fixed') => updateData({ discountType: val })}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Discount Value</Label>
                  <Input className="rounded-xl" type="number" value={data.discountValue} onChange={(e) => updateData({ discountValue: Number(e.target.value) })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4">
          <Card className="rounded-2xl border shadow-xs">
            <CardHeader><CardTitle>Taxes (GST/VAT)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Tax Rate (%)</Label>
                  <Input className="rounded-xl" type="number" value={data.taxRate} onChange={(e) => updateData({ taxRate: Number(e.target.value) })} placeholder="General Tax" />
                  <p className="text-xs text-muted-foreground">Use this for single tax system.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 border-t pt-4">
                <div className="space-y-2">
                  <Label>CGST (%)</Label>
                  <Input className="rounded-xl" type="number" value={data.cgstRate} onChange={(e) => updateData({ cgstRate: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>SGST (%)</Label>
                  <Input className="rounded-xl" type="number" value={data.sgstRate} onChange={(e) => updateData({ sgstRate: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>IGST (%)</Label>
                  <Input className="rounded-xl" type="number" value={data.igstRate} onChange={(e) => updateData({ igstRate: Number(e.target.value) })} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border shadow-xs">
            <CardHeader><CardTitle>Additional Fees</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                <div className="space-y-2">
                  <Label>Shipping Fee</Label>
                  <Input className="rounded-xl" type="number" value={data.shippingFee} onChange={(e) => updateData({ shippingFee: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Packaging Fee</Label>
                  <Input className="rounded-xl" type="number" value={data.packagingFee} onChange={(e) => updateData({ packagingFee: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Handling Fee</Label>
                  <Input className="rounded-xl" type="number" value={data.handlingFee} onChange={(e) => updateData({ handlingFee: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border-t pt-4">
                <div className="space-y-2">
                  <Label>Amount Paid</Label>
                  <Input className="rounded-xl" type="number" value={data.amountPaid} onChange={(e) => updateData({ amountPaid: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Balance Due</Label>
                  <div className="h-10 flex items-center px-3 font-semibold text-lg bg-muted rounded-xl border">
                    {data.currency} {data.balanceDue.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking" className="space-y-4">
          <Card className="rounded-2xl border shadow-xs">
            <CardHeader><CardTitle>Bank Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input className="rounded-xl" value={data.bankName} onChange={(e) => updateData({ bankName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Account Name</Label>
                  <Input className="rounded-xl" value={data.accountHolderName} onChange={(e) => updateData({ accountHolderName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input className="rounded-xl" value={data.accountNumber} onChange={(e) => updateData({ accountNumber: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>IFSC / Routing Code</Label>
                  <Input className="rounded-xl" value={data.ifscCode} onChange={(e) => updateData({ ifscCode: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>SWIFT / BIC Code</Label>
                  <Input className="rounded-xl" value={data.swiftCode} onChange={(e) => updateData({ swiftCode: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Input className="rounded-xl" value={data.branch} onChange={(e) => updateData({ branch: e.target.value })} />
                </div>
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <Label>UPI ID (For India)</Label>
                <Input className="rounded-xl" value={data.upiId} onChange={(e) => updateData({ upiId: e.target.value })} placeholder="e.g. yourname@upi" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Template & Theme</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Template Design</Label>
                  <Select value={data.template} onValueChange={(val: any) => updateData({ template: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="apex">Apex</SelectItem>
                      <SelectItem value="lumina">Lumina</SelectItem>
                      <SelectItem value="nexus">Nexus</SelectItem>
                      <SelectItem value="heritage">Heritage</SelectItem>
                      <SelectItem value="prism">Prism</SelectItem>
                      <SelectItem value="velocity">Velocity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Font</Label>
                  <Select value={data.font} onValueChange={(val: string) => updateData({ font: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter (Sans)</SelectItem>
                      <SelectItem value="serif">Merriweather (Serif)</SelectItem>
                      <SelectItem value="mono">Roboto Mono</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <Input type="color" value={data.themeColor} onChange={(e) => updateData({ themeColor: e.target.value })} className="w-12 h-10 p-1 cursor-pointer" />
                    <Input type="text" value={data.themeColor} onChange={(e) => updateData({ themeColor: e.target.value })} className="flex-1 uppercase font-mono text-xs" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Visual Elements Toggles</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex flex-col"><span className="font-medium">Show QR Code</span><span className="font-normal text-xs text-muted-foreground">For UPI or Payment Links</span></Label>
                <Switch checked={data.showQRCode} onCheckedChange={(val) => updateData({ showQRCode: val })} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="flex flex-col"><span className="font-medium">Show Bank Details</span><span className="font-normal text-xs text-muted-foreground">Display bank block on document</span></Label>
                <Switch checked={data.showBankDetails} onCheckedChange={(val) => updateData({ showBankDetails: val })} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="flex flex-col"><span className="font-medium">Company Stamp</span><span className="font-normal text-xs text-muted-foreground">Digital Approved Stamp</span></Label>
                <Switch checked={data.showStamp} onCheckedChange={(val) => updateData({ showStamp: val })} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="flex flex-col"><span className="font-medium">Signature</span><span className="font-normal text-xs text-muted-foreground">Authorized signature block</span></Label>
                <Switch checked={data.showSignature} onCheckedChange={(val) => updateData({ showSignature: val })} />
              </div>
              
              {data.showSignature && (
                <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 ml-2 mt-4 bg-muted/20 p-4 rounded-r-md">
                   <div className="space-y-2">
                     <Label>Signature Title</Label>
                     <Input value={data.signatureTitle} onChange={(e) => updateData({ signatureTitle: e.target.value })} />
                   </div>
                   <div className="space-y-2">
                     <Label>Signature Font</Label>
                     <Select value={data.signatureFont} onValueChange={(val: any) => updateData({ signatureFont: val })}>
                       <SelectTrigger><SelectValue /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="dancing">Dancing Script</SelectItem>
                         <SelectItem value="greatvibes">Great Vibes</SelectItem>
                         <SelectItem value="sacramento">Sacramento</SelectItem>
                         <SelectItem value="pacifico">Pacifico</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <Label className="flex flex-col"><span className="font-medium">Watermark Overlay</span><span className="font-normal text-xs text-muted-foreground">Diagonal status watermark</span></Label>
                <Switch checked={data.showWatermark} onCheckedChange={(val) => updateData({ showWatermark: val })} />
              </div>

              {data.showWatermark && (
                <div className="pl-4 border-l-2 ml-2 mt-4 bg-muted/20 p-4 rounded-r-md">
                   <Label>Watermark Text</Label>
                   <Select value={data.watermarkStatus || ''} onValueChange={(val: any) => updateData({ watermarkStatus: val })}>
                     <SelectTrigger className="mt-2"><SelectValue placeholder="Select Status" /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="PAID">PAID</SelectItem>
                       <SelectItem value="DRAFT">DRAFT</SelectItem>
                       <SelectItem value="OVERDUE">OVERDUE</SelectItem>
                       <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                       <SelectItem value="SAMPLE">SAMPLE</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Additional Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Notes & Terms</Label>
                <Textarea value={data.notes} onChange={(e) => updateData({ notes: e.target.value })} placeholder="Notes to the client" className="min-h-[120px]" />
              </div>
              <div className="space-y-2">
                <Label>Payment Instructions</Label>
                <Textarea value={data.paymentDetails} onChange={(e) => updateData({ paymentDetails: e.target.value })} placeholder="Bank transfer details, Paypal link, etc." className="min-h-[120px]" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
