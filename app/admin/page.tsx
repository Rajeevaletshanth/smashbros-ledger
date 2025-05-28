"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Plus,
  Users,
  DollarSign,
  Gift,
  ShoppingCart,
  Wrench,
  Award,
  MapPin,
  CheckCircle,
  Activity,
} from "lucide-react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { createExpense, createOrUpdateDailyCollection, createSponsor, getAllExpenses, getAllMemberNames, getAllSponsors, getMonthlyFinancialData } from "@/service/service"

interface AdminDashboardProps {
  onBack: () => void
}

const categories = [
  { value: "equipment", label: "Equipment", icon: ShoppingCart },
  { value: "facility", label: "Facility", icon: MapPin },
  { value: "maintenance", label: "Maintenance", icon: Wrench },
  { value: "competition", label: "Competition", icon: Award },
]

const months = [
  { value: "may", label: "May" },
  { value: "jun", label: "June" },
  { value: "jul", label: "July" },
  { value: "aug", label: "August" },
  { value: "sep", label: "September" },
  { value: "oct", label: "October" },
  { value: "nov", label: "November" },
  { value: "dec", label: "December" },
]

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "expenses" | "sponsors">("overview")
  const [memberForm, setMemberForm] = useState<any>({ name: "", month: "", amount: 0 })
  const [expenseForm, setExpenseForm] = useState<any>({
    date: "",
    name: "",
    amount: 0,
    description: "",
    category: "",
    icon: "",
  })
  const [sponsorForm, setSponsorForm] = useState<any>({ name: "", date: "", amount: 0 })
  const [isNewMember, setIsNewMember] = useState<boolean>(false)

  // Mock data for admin dashboard
  const [adminData, setAdminData] = useState<any>({
    totalCollected: 0,
    totalExpenses: 0,
    balanceInHand: 0,
    totalMembers: 0,
    activeSponsors: 0,
    thisMonthCollection: 0,
  })

  const [membersList, setMembersList] = useState<any>([])

  const [recentExpenses, setExpensesList] = useState<any>([])

  const [recentSponsors, setSponsorsList] = useState<any>([])

  const fetchData = async() => {
    try {
      const adminDataTemp:any = await getMonthlyFinancialData();
      setAdminData(adminDataTemp.data)

      const memListTemp:any = await getAllMemberNames();
      setMembersList(memListTemp.data)

      const recentExpensesTemp:any = await getAllExpenses();
      setExpensesList(recentExpensesTemp.data)

      const recentSponsorsTemp:any = await getAllSponsors();
      setSponsorsList(recentSponsorsTemp.data)
    } catch (error) {
      
    }
  }

  useEffect(() => {
    fetchData()
  },[])

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response:any = await createOrUpdateDailyCollection(memberForm)
    setMemberForm({ name: "", month: "", amount: 0 })
    fetchData()
  }

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Expense form submitted:", expenseForm)
    const response:any = await createExpense(expenseForm)
    setExpenseForm({ date: "", name: "", amount: 0, description: "", category: "", icon: "" })
    fetchData()
  }

  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Sponsor form submitted:", sponsorForm)
    const response:any = await createSponsor(sponsorForm)
    setSponsorForm({ name: "", date: "", amount: 0 })
    fetchData()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                
              </Button>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center p-2">
                  <Image
                    src="/smashbros-logo.png"
                    alt="SmashBros Logo"
                    width={90}
                    height={90}
                    className="object-contain filter invert"
                  />
                </div>
                {/* <div>
                  <h1 className="text-xl font-bold text-gray-900">SmashLedger Admin</h1>
                  <p className="text-sm text-gray-500">Manage Financial Records</p>
                </div> */}
              </div>
            </div>
            <Badge variant="outline" className="text-gray-600 border-gray-300 bg-white">
              Administrator
            </Badge>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <motion.div
          className="flex space-x-1 bg-white p-1 rounded-xl border border-gray-200 mb-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            onClick={() => setActiveTab("overview")}
            className={`flex-1 ${
              activeTab === "overview"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === "members" ? "default" : "ghost"}
            onClick={() => setActiveTab("members")}
            className={`flex-1 ${
              activeTab === "members"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Members
          </Button>
          <Button
            variant={activeTab === "expenses" ? "default" : "ghost"}
            onClick={() => setActiveTab("expenses")}
            className={`flex-1 ${
              activeTab === "expenses"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Expenses
          </Button>
          <Button
            variant={activeTab === "sponsors" ? "default" : "ghost"}
            onClick={() => setActiveTab("sponsors")}
            className={`flex-1 ${
              activeTab === "sponsors"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Gift className="w-4 h-4 mr-2" />
            Sponsors
          </Button>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-100">Total Collected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rs. {adminData.totalCollected.toLocaleString()}</div>
                  <p className="text-xs text-green-100 mt-1">All time collections</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-100">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rs. {adminData.totalExpenses.toLocaleString()}</div>
                  <p className="text-xs text-red-100 mt-1">All time expenses</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-100">Balance in Hand</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rs. {adminData.balanceInHand.toLocaleString()}</div>
                  <p className="text-xs text-blue-100 mt-1">Available funds</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-purple-100">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rs. {adminData.thisMonthCollection.toLocaleString()}</div>
                  <p className="text-xs text-purple-100 mt-1">Current month collection</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Member Contributions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active Members</span>
                      <span className="font-semibold">{adminData.totalMembers}</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-gray-500">85% payment completion rate</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-red-600" />
                    Recent Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentExpenses.slice(0, 3).map((expense:any, index:number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate">{expense.name}</span>
                        <span className="font-semibold">Rs. {expense.amount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-purple-600" />
                    Sponsorship Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active Sponsors</span>
                      <span className="font-semibold">{adminData.activeSponsors}</span>
                    </div>
                    <div className="space-y-2">
                      {recentSponsors.slice(0, 2).map((sponsor:any, index:number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600 truncate">{sponsor.name}</span>
                          <span className="font-semibold">Rs. {sponsor.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  Add/Update Member Payment
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Record monthly contributions for community members</p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleMemberSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="memberName" className="text-gray-700 font-medium">
                        Member Name
                      </Label>
                      {!isNewMember ? <Select
                        value={memberForm.name}
                        onValueChange={(value) => setMemberForm({ ...memberForm, name: value })}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select member" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {membersList.map((member:any) => (
                            <SelectItem key={member} value={member} className="text-gray-900">
                              {member}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>:
                      <Input
                        id="name"
                        value={memberForm.name}
                        onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                        placeholder="Enter name"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />}
                      <Button variant='secondary' size={'sm'} onClick={() => setIsNewMember(!isNewMember)}>{isNewMember ? 'Old Member' : 'New Member'}</Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="month" className="text-gray-700 font-medium">
                        Month
                      </Label>
                      <Select
                        value={memberForm.month}
                        onValueChange={(value) => setMemberForm({ ...memberForm, month: value })}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value} className="text-gray-900">
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-gray-700 font-medium">
                        Amount (Rs. )
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        value={memberForm.amount}
                        onChange={(e) => setMemberForm({ ...memberForm, amount: e.target.value })}
                        placeholder="Enter amount"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Payment Record
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Expenses Tab */}
        {activeTab === "expenses" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-gray-100">
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  Add New Expense
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Record club expenses with detailed information</p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleExpenseSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="expenseDate" className="text-gray-700 font-medium">
                        Date
                      </Label>
                      <Input
                        id="expenseDate"
                        type="date"
                        value={expenseForm.date}
                        onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expenseName" className="text-gray-700 font-medium">
                        Expense Name
                      </Label>
                      <Input
                        id="expenseName"
                        value={expenseForm.name}
                        onChange={(e) => setExpenseForm({ ...expenseForm, name: e.target.value })}
                        placeholder="e.g., Shuttle Barrel - 1"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expenseAmount" className="text-gray-700 font-medium">
                        Amount (Rs. )
                      </Label>
                      <Input
                        id="expenseAmount"
                        type="number"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                        placeholder="Enter amount"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-700 font-medium">
                        Category
                      </Label>
                      <Select
                        value={expenseForm.category}
                        onValueChange={(value) => setExpenseForm({ ...expenseForm, category: value })}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value} className="text-gray-900">
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700 font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                      placeholder="Enter detailed description of the expense"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-md"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Add Expense Record
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sponsors Tab */}
        {activeTab === "sponsors" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  Add New Sponsor
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Record sponsorship contributions and partnerships</p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSponsorSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sponsorName" className="text-gray-700 font-medium">
                        Sponsor Name
                      </Label>
                      <Input
                        id="sponsorName"
                        value={sponsorForm.name}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                        placeholder="Enter sponsor organization name"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sponsorDate" className="text-gray-700 font-medium">
                        Date
                      </Label>
                      <Input
                        id="sponsorDate"
                        type="date"
                        value={sponsorForm.date}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, date: e.target.value })}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sponsorAmount" className="text-gray-700 font-medium">
                        Amount (Rs. )
                      </Label>
                      <Input
                        id="sponsorAmount"
                        type="number"
                        value={sponsorForm.amount}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, amount: e.target.value })}
                        placeholder="Enter sponsorship amount"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Add Sponsor Record
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
