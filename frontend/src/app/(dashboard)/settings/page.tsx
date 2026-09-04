"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useColor } from "@/components/color-provider"
import { useTheme } from "next-themes"
import { authApi } from "@/lib/api"

function SettingsContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam || "profile")
  const { primaryColor, setPrimaryColor } = useColor()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Profile data from auth
  const [profileName, setProfileName] = useState("")
  const [profileEmail, setProfileEmail] = useState("")

  // Local storage states for demo persistence
  const [settings, setSettings] = useState({
    // Bank & UPI
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifsc: "",
    swift: "",
    branch: "",
    upiId: "",
    // Numbering
    invoicePrefix: "INV/2026/",
    quotePrefix: "EST/2026/",
    creditNotePrefix: "CN/2026/",
    autoIncrement: true,
    startingNumber: "0001",
    // Defaults
    paymentTerms: "Net 15",
    defaultNotes: "Thank you for your business!",
    defaultPaymentInstructions: "Please make payment via UPI or Bank Transfer.",
    // Business
    gstin: "",
    pan: "",
    billingAddress: "",
    shippingAddress: ""
  })

  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("inkviz_settings")
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (e) {}
    }

    const currentUser = authApi.getCurrentUser()
    if (currentUser) {
      setProfileName(currentUser.name || "")
      setProfileEmail(currentUser.email || "")
    }
  }, [])

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleSave = () => {
    localStorage.setItem("inkviz_settings", JSON.stringify(settings))
    setSaveSuccessMessage("Settings saved successfully! Changes will apply to all new documents.")
    setTimeout(() => setSaveSuccessMessage(null), 3500)
  }

  const handleSaveProfile = () => {
    authApi.updateCurrentUser({ name: profileName, email: profileEmail })
    setSaveSuccessMessage("Profile updated successfully!")
    setTimeout(() => setSaveSuccessMessage(null), 3500)
  }

  if (!mounted) return null // Prevent hydration mismatch for themes

  return (
    <div className="space-y-8 p-4 md:p-8 pt-6 relative">
      {saveSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {saveSuccessMessage}
        </div>
      )}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            {[
              { id: "profile", label: "Profile" },
              { id: "business", label: "Business Details" },
              { id: "bank", label: "Bank & UPI Details" },
              { id: "numbering", label: "Document Numbering" },
              { id: "defaults", label: "Defaults & Terms" },
              { id: "appearance", label: "Appearance" },
              { id: "notifications", label: "Notifications" }
            ].map(tab => (
              <Button 
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"} 
                className="justify-start w-full whitespace-nowrap"
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="flex-1 max-w-3xl">
          {activeTab === "profile" && (
            <Card className="rounded-2xl border shadow-xs">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and contact email address.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter your name"
                    className="rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} className="bg-primary text-primary-foreground font-semibold rounded-xl">
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "business" && (
            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>This information will appear on your invoices by default.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Business Name</Label>
                    <Input defaultValue="My Company LLC" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Business Email</Label>
                    <Input type="email" defaultValue="hello@mycompany.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label>GSTIN / VAT Number</Label>
                    <Input 
                      value={settings.gstin} 
                      onChange={e => setSettings({...settings, gstin: e.target.value})} 
                      placeholder="22AAAAA0000A1Z5" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>PAN Number</Label>
                    <Input 
                      value={settings.pan} 
                      onChange={e => setSettings({...settings, pan: e.target.value})} 
                      placeholder="ABCDE1234F" 
                    />
                  </div>
                  <div className="grid gap-2 col-span-2">
                    <Label>Billing Address</Label>
                    <Textarea 
                      rows={3} 
                      value={settings.billingAddress} 
                      onChange={e => setSettings({...settings, billingAddress: e.target.value})} 
                    />
                  </div>
                  <div className="grid gap-2 col-span-2">
                    <Label>Shipping Address (Optional)</Label>
                    <Textarea 
                      rows={3} 
                      value={settings.shippingAddress} 
                      onChange={e => setSettings({...settings, shippingAddress: e.target.value})} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter><Button onClick={handleSave}>Save Business Details</Button></CardFooter>
            </Card>
          )}

          {activeTab === "bank" && (
            <Card>
              <CardHeader>
                <CardTitle>Bank & UPI Details</CardTitle>
                <CardDescription>Set up the payment details displayed on invoices.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2 col-span-2">
                    <Label>Bank Name</Label>
                    <Input value={settings.bankName} onChange={e => setSettings({...settings, bankName: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Account Holder Name</Label>
                    <Input value={settings.accountName} onChange={e => setSettings({...settings, accountName: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Account Number</Label>
                    <Input value={settings.accountNumber} onChange={e => setSettings({...settings, accountNumber: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>IFSC Code</Label>
                    <Input value={settings.ifsc} onChange={e => setSettings({...settings, ifsc: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Branch</Label>
                    <Input value={settings.branch} onChange={e => setSettings({...settings, branch: e.target.value})} />
                  </div>
                  <div className="grid gap-2 col-span-2 mt-4 border-t pt-4">
                    <Label>UPI ID / VPA</Label>
                    <Input 
                      placeholder="example@upi" 
                      value={settings.upiId} 
                      onChange={e => setSettings({...settings, upiId: e.target.value})} 
                    />
                    <p className="text-xs text-muted-foreground">This is used to generate the Scan-to-Pay QR code on your invoices.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter><Button onClick={handleSave}>Save Bank Details</Button></CardFooter>
            </Card>
          )}

          {activeTab === "numbering" && (
            <Card>
              <CardHeader>
                <CardTitle>Document Numbering</CardTitle>
                <CardDescription>Customize the format of your document numbers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <Label className="text-base">Auto-Increment</Label>
                      <p className="text-sm text-muted-foreground">Automatically generate the next invoice number.</p>
                    </div>
                    <Switch 
                      checked={settings.autoIncrement} 
                      onCheckedChange={c => setSettings({...settings, autoIncrement: c})} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Invoice Prefix</Label>
                      <Input value={settings.invoicePrefix} onChange={e => setSettings({...settings, invoicePrefix: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Starting Number</Label>
                      <Input value={settings.startingNumber} onChange={e => setSettings({...settings, startingNumber: e.target.value})} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter><Button onClick={handleSave} className="bg-primary text-primary-foreground font-semibold rounded-xl">Save Numbering</Button></CardFooter>
            </Card>
          )}

          {activeTab === "defaults" && (
            <Card className="rounded-2xl border shadow-xs">
              <CardHeader>
                <CardTitle>Defaults & Terms</CardTitle>
                <CardDescription>Default text loaded onto every new invoice.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Default Payment Terms</Label>
                  <Input value={settings.paymentTerms} onChange={e => setSettings({...settings, paymentTerms: e.target.value})} placeholder="e.g. Net 15, Due on Receipt" className="rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <Label>Default Notes / Message</Label>
                  <Textarea rows={3} value={settings.defaultNotes} onChange={e => setSettings({...settings, defaultNotes: e.target.value})} className="rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <Label>Default Payment Instructions</Label>
                  <Textarea rows={3} value={settings.defaultPaymentInstructions} onChange={e => setSettings({...settings, defaultPaymentInstructions: e.target.value})} className="rounded-xl" />
                </div>
              </CardContent>
              <CardFooter><Button onClick={handleSave} className="bg-primary text-primary-foreground font-semibold rounded-xl">Save Defaults</Button></CardFooter>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card className="rounded-2xl border shadow-xs">
              <CardHeader>
                <CardTitle>Appearance & Theme</CardTitle>
                <CardDescription>Customize the look and feel of your app interface.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Theme Mode</h3>
                  <div className="flex gap-4">
                    <Button 
                      variant={theme === "light" ? "default" : "outline"} 
                      className="w-32 rounded-xl"
                      onClick={() => setTheme("light")}
                    >
                      Light
                    </Button>
                    <Button 
                      variant={theme === "dark" ? "default" : "outline"} 
                      className="w-32 rounded-xl"
                      onClick={() => setTheme("dark")}
                    >
                      Dark
                    </Button>
                    <Button 
                      variant={theme === "system" ? "default" : "outline"} 
                      className="w-32 rounded-xl"
                      onClick={() => setTheme("system")}
                    >
                      System
                    </Button>
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-semibold">Brand Accent Color</h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      {[
                        { name: "Indigo", hex: "#6366F1" },
                        { name: "Blue", hex: "#2563EB" },
                        { name: "Violet", hex: "#8B5CF6" },
                        { name: "Emerald", hex: "#10B981" },
                        { name: "Amber", hex: "#F59E0B" },
                        { name: "Rose", hex: "#F43F5E" },
                        { name: "Slate", hex: "#334155" },
                      ].map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setPrimaryColor(c.hex)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                            primaryColor.toLowerCase() === c.hex.toLowerCase()
                              ? "ring-2 ring-offset-2 ring-primary scale-110"
                              : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {primaryColor.toLowerCase() === c.hex.toLowerCase() && (
                            <svg className="w-4 h-4 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <Input 
                        type="color" 
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-14 h-10 p-1 cursor-pointer rounded-xl" 
                      />
                      <div>
                        <p className="text-xs font-mono uppercase text-foreground">{primaryColor}</p>
                        <p className="text-xs text-muted-foreground">Changes apply instantly to your buttons and highlights.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how you receive alerts and updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Invoice Viewed</Label>
                    <p className="text-sm text-muted-foreground">Receive an email when a client views your invoice.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  )
}
