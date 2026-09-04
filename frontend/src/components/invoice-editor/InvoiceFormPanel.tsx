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
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4 h-auto">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="taxes">Taxes/Fees</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card className="rounded-2xl border shadow-xs">
            <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Type</Label>
                  <Select value={data.documentType} onValueChange={(val: any) => updateData({ documentType: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoice">Standard Invoice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={data.currency} onValueChange={(val: any) => updateData({ currency: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <Input value={data.invoiceNumber} onChange={(e) => updateData({ invoiceNumber: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>PO Number</Label>
                  <Input value={data.poNumber} onChange={(e) => updateData({ poNumber: e.target.value })} placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input type="date" value={data.issueDate} onChange={(e) => updateData({ issueDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" value={data.dueDate} onChange={(e) => updateData({ dueDate: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border shadow-xs">
            <CardHeader><CardTitle>Parties</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-primary">Bill From</h3>
                <div className="grid gap-4">
                  <Input placeholder="Company Name" value={data.billFrom.name} onChange={(e) => updateData({ billFrom: { ...data.billFrom, name: e.target.value } })} />
                  <Input placeholder="Email Address" type="email" value={data.billFrom.email} onChange={(e) => updateData({ billFrom: { ...data.billFrom, email: e.target.value } })} />
                  <Textarea placeholder="Physical Address" value={data.billFrom.address} onChange={(e) => updateData({ billFrom: { ...data.billFrom, address: e.target.value } })} />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-primary">Bill To</h3>
                <div className="grid gap-4">
                  <Input placeholder="Client Name" value={data.client.name} onChange={(e) => updateData({ client: { ...data.client, name: e.target.value } })} />
                  <Input placeholder="Client Email" type="email" value={data.client.email} onChange={(e) => updateData({ client: { ...data.client, email: e.target.value } })} />
                  <Textarea placeholder="Client Address" value={data.client.address} onChange={(e) => updateData({ client: { ...data.client, address: e.target.value } })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
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
                className="text-xs h-8"
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
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-start border p-4 rounded-md bg-muted/20 relative group">
                    <div className="col-span-12 md:col-span-5 space-y-2 relative">
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
                          placeholder="Type product name (e.g. Chair, Cloud, SSD...)" 
                        />

                        {/* Dropdown Popover */}
                        {isAutocompleteOpen && (
                          <div 
                            className="absolute left-0 right-0 top-full mt-1 bg-popover text-popover-foreground border shadow-xl rounded-md z-50 overflow-hidden divide-y"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <div className="p-1.5 bg-muted/50 text-[11px] font-medium text-muted-foreground flex items-center justify-between">
                              <span>Matching Catalog Items</span>
                              <span className="text-[10px]">Click to auto-fill</span>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
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

                      <div className="flex gap-2">
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">HSN/SAC</Label>
                          <Input 
                            className="h-8 text-xs font-mono" 
                            value={item.hsnCode} 
                            onChange={(e) => updateItem(item.id, { hsnCode: e.target.value })} 
                            placeholder="Code" 
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">Unit</Label>
                          <Select 
                            value={item.unit} 
                            onValueChange={(val: any) => updateItem(item.id, { unit: val })}
                          >
                            <SelectTrigger className="h-8 text-xs">
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
                    </div>

                    <div className="col-span-4 md:col-span-2 space-y-1">
                      <Label className="text-xs">Qty</Label>
                      <Input 
                        type="number" 
                        min="1"
                        value={item.quantity} 
                        onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })} 
                      />
                    </div>

                    <div className="col-span-4 md:col-span-2 space-y-1">
                      <Label className="text-xs">Rate</Label>
                      <Input 
                        type="number" 
                        value={item.rate} 
                        onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })} 
                      />
                      <Label className="text-xs text-muted-foreground">Disc</Label>
                      <Input 
                        className="h-8 text-xs" 
                        type="number" 
                        value={item.itemDiscount} 
                        onChange={(e) => updateItem(item.id, { itemDiscount: Number(e.target.value) })} 
                      />
                    </div>

                    <div className="col-span-4 md:col-span-3 space-y-1 flex flex-col justify-between h-full">
                      <Label className="text-xs">Amount</Label>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-sm">
                          {getCurrencySymbol(data.currency)} {(item.amount - (Number(item.itemDiscount)||0)).toFixed(2)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" 
                          onClick={() => removeItem(item.id)} 
                          disabled={data.items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex gap-2 mt-2">
                <Button variant="outline" className="flex-1" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" /> Add Blank Item
                </Button>
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={() => setIsCatalogModalOpen(true)}
                >
                  <Boxes className="w-4 h-4 mr-2 text-primary" /> Select From Catalog
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Catalog Picker Dialog Modal */}
          <Dialog open={isCatalogModalOpen} onOpenChange={setIsCatalogModalOpen}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Products & Services Catalog</DialogTitle>
                <DialogDescription>
                  Click any item below to populate or add it directly into your invoice.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search catalog by name, SKU, or HSN/SAC..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="border rounded-md overflow-hidden max-h-96 overflow-y-auto divide-y">
                  {products
                    .filter(p => 
                      !catalogSearch || 
                      p.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                      p.sku.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                      p.hsnSac.toLowerCase().includes(catalogSearch.toLowerCase())
                    )
                    .map((prod) => (
                      <div 
                        key={prod.id} 
                        className="p-3 hover:bg-muted/40 transition-colors flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">{prod.name}</span>
                            <Badge variant="outline" className="text-[10px] py-0 h-4">
                              {prod.type}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground text-xs mt-0.5 truncate">
                            {prod.description}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                            {prod.sku && <span>SKU: <strong className="font-mono text-foreground">{prod.sku}</strong></span>}
                            {prod.hsnSac && <span>HSN: <strong className="font-mono text-foreground">{prod.hsnSac}</strong></span>}
                            <span>GST: <strong>{prod.taxRate}%</strong></span>
                            {prod.type === 'Goods' && (
                              <span>Stock: <strong>{prod.stock} {prod.unit}</strong></span>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0 space-y-1.5">
                          <div className="text-base font-bold text-foreground">
                            {getCurrencySymbol(data.currency)}{prod.sellingPrice.toLocaleString()}
                            <span className="text-xs text-muted-foreground font-normal"> / {prod.unit}</span>
                          </div>
                          <Button 
                            type="button"
                            size="sm" 
                            className="h-7 text-xs"
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
                            Insert to Invoice
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader><CardTitle>Global Discount</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select value={data.discountType} onValueChange={(val: 'percentage'|'fixed') => updateData({ discountType: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Discount Value</Label>
                  <Input type="number" value={data.discountValue} onChange={(e) => updateData({ discountValue: Number(e.target.value) })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Taxes (GST/VAT)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Tax Rate (%)</Label>
                  <Input type="number" value={data.taxRate} onChange={(e) => updateData({ taxRate: Number(e.target.value) })} placeholder="General Tax" />
                  <p className="text-xs text-muted-foreground">Use this for single tax system.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t pt-4">
                <div className="space-y-2">
                  <Label>CGST (%)</Label>
                  <Input type="number" value={data.cgstRate} onChange={(e) => updateData({ cgstRate: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>SGST (%)</Label>
                  <Input type="number" value={data.sgstRate} onChange={(e) => updateData({ sgstRate: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>IGST (%)</Label>
                  <Input type="number" value={data.igstRate} onChange={(e) => updateData({ igstRate: Number(e.target.value) })} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Additional Fees</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Shipping Fee</Label>
                  <Input type="number" value={data.shippingFee} onChange={(e) => updateData({ shippingFee: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Packaging Fee</Label>
                  <Input type="number" value={data.packagingFee} onChange={(e) => updateData({ packagingFee: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Handling Fee</Label>
                  <Input type="number" value={data.handlingFee} onChange={(e) => updateData({ handlingFee: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-2">
                  <Label>Amount Paid</Label>
                  <Input type="number" value={data.amountPaid} onChange={(e) => updateData({ amountPaid: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Balance Due</Label>
                  <div className="h-10 flex items-center px-3 font-semibold text-lg bg-muted rounded-md border">
                    {data.currency} {data.balanceDue.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Bank Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input value={data.bankName} onChange={(e) => updateData({ bankName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Account Name</Label>
                  <Input value={data.accountHolderName} onChange={(e) => updateData({ accountHolderName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input value={data.accountNumber} onChange={(e) => updateData({ accountNumber: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>IFSC / Routing Code</Label>
                  <Input value={data.ifscCode} onChange={(e) => updateData({ ifscCode: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>SWIFT / BIC Code</Label>
                  <Input value={data.swiftCode} onChange={(e) => updateData({ swiftCode: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Input value={data.branch} onChange={(e) => updateData({ branch: e.target.value })} />
                </div>
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <Label>UPI ID (For India)</Label>
                <Input value={data.upiId} onChange={(e) => updateData({ upiId: e.target.value })} placeholder="e.g. yourname@upi" />
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
