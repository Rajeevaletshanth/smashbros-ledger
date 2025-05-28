"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Trophy,
  TrendingUp,
  Calendar,
  Gift,
  Star,
  ArrowUpRight,
  Zap,
  Target,
  Activity,
  ShoppingCart,
  Wrench,
  Award,
  MapPin,
  Settings,
  Users,
  Lock,
  Mail,
  Phone,
  Globe,
  Clock,
  Heart,
} from "lucide-react"
import AdminDashboard from "./admin/page"
import Image from "next/image"
import { getAllCollections, getAllExpenses, getAllSponsors, getFinancialSummary, getMonthlyFinancialData, getTopContributor } from "@/service/service"

const achievements = [
  { title: "Monthly Target Achieved", description: "Reached 100% collection goal for December", icon: Trophy },
  { title: "New Member Milestone", description: "50+ active members joined this year", icon: Users },
  { title: "Equipment Upgraded", description: "Latest badminton gear acquired for training", icon: Award },
  { title: "Tournament Success", description: "Won inter-club championship 2025", icon: Star },
  { title: "Financial Transparency", description: "100% transparent financial management", icon: Target },
]

const testimonials = [
  {
    name: "Rajesh Kumar",
    text: "SmashLedger has made our club finances completely transparent!",
    role: "Club Captain",
  },
  { name: "Priya Sharma", text: "Easy to track payments and see where our money goes.", role: "Senior Member" },
  { name: "Amit Singh", text: "Professional financial management for our badminton community.", role: "Treasurer" },
]

const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Month mapping for comparison
const monthMapping: { [key: string]: number } = {
  may: 4, // May = 4 (0-indexed)
  jun: 5, // June = 5
  jul: 6, // July = 7
  aug: 7, // August = 7
  sep: 8, // September = 8
  oct: 9, // October = 9
  nov: 10, // November = 10
  dec: 11, // December = 11
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

const shuttlecockVariants = {
  animate: {
    y: [-20, 20, -20],
    x: [-10, 10, -10],
    rotate: [0, 180, 360],
    transition: {
      duration: 8,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

export default function SmashLedger() {
  const [currentView, setCurrentView] = useState<"dashboard" | "admin">("dashboard")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [testimonialSlide, setTestimonialSlide] = useState(0)
  const [password, setPassword] = useState("")
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isSponsorDialogOpen, setIsSponsorDialogOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  // Get current month (0-indexed)
  const currentMonth = new Date().getMonth()

  const [topContributor, setTopContributor] = useState<any>({
    name: "",
    totalAmount: 0,
  })

  const [financialSummary, setFinancialSummary] = useState<any>({
    totalCollected: 0,
    totalExpenses: 0,
    balanceInHand: 0,
  })

  const [monthlyData, setMonthlyData] = useState<any>({
    thisMonthCollection: 0,
    thisMonthExpenses: 0,
  })

  const [members, setMembers] = useState<any>([])
  const [expenses, setExpenses] = useState<any>([])
  const [sponsors, setSponsors] = useState<any>([])


  const fetchData = async () => {
    try {
      const response: any = await getTopContributor();
      setTopContributor(response.data)

      const fsum: any = await getFinancialSummary();
      setFinancialSummary(fsum.data)

      const mdata: any = await getMonthlyFinancialData();
      setMonthlyData({
        thisMonthCollection: mdata.data.thisMonthCollection,
        thisMonthExpenses: mdata.data.thisMonthExpenses,
      })

      const collection: any = await getAllCollections();
      setMembers(collection.data)

      const expensesData: any = await getAllExpenses();
      if (expensesData.data) {
        let tempExpenses: any = [];
        expensesData.data.map((item: any) => {
          tempExpenses.push({
            date: item.date,
            name: item.name,
            amount: item.amount,
            description: item.description,
            category: item.category,
            icon: item.icon === 'Wrench' ? Wrench : item.icon === 'MapPin' ? MapPin : ShoppingCart,
          })
        })
        setExpenses(tempExpenses)

        const sponsorsTemp: any = await getAllSponsors()
        setSponsors(sponsorsTemp.data)
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % achievements.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + achievements.length) % achievements.length)
  }

  const nextTestimonial = () => {
    setTestimonialSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setTestimonialSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleAdminAccess = () => {
    if (password === "smashbros2025") {
      setCurrentView("admin")
      setIsPasswordDialogOpen(false)
      setPassword("")
    } else {
      alert("Incorrect password!")
    }
  }

  // Function to determine payment status display
  const getPaymentStatusDisplay = (amount: number | null, monthKey: any) => {
    const monthIndex = monthMapping[monthKey]

    if (amount) {
      // Payment made
      return (
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="inline-flex items-center justify-center w-20 h-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-lg shadow-lg"
        >
          Rs. {amount}
        </motion.div>
      )
    } else {
      // No payment made
      if (monthIndex <= currentMonth) {
        // Past or current month - show "Not Paid"
        return (
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="inline-flex items-center justify-center w-20 h-8 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-lg"
          >
            Not Paid
          </motion.div>
        )
      } else {
        // Future month - show "-"
        return <div className="inline-flex items-center justify-center w-20 h-8 text-gray-500 text-sm font-bold">-</div>
      }
    }
  }

  if (currentView === "admin") {
    return <AdminDashboard onBack={() => setCurrentView("dashboard")} />
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <motion.header
        className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex ">
                <Image src="/smashbros-logo.png" alt="SmashBros Logo" width={110} height={110} className="mt-1" />
              </div>
              {/* <div>
                <h1 className="text-2xl font-bold text-white">SmashBros.</h1>
                <p className="text-sm text-gray-400">Ledger</p>
              </div> */}
            </motion.div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-gray-300 border-gray-600 bg-gray-800">
                Dashboard
              </Badge>
              <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white bg-gray-800/50 backdrop-blur-sm"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-gray-800 border border-gray-600">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                      <Lock className="w-5 h-5 text-purple-400" />
                      Admin Access Required
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Enter Password:</label>
                      <Input
                        type="password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAdminAccess()}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAdminAccess}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Access Admin Panel
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setIsPasswordDialogOpen(false)}
                        className="border-gray-600 text-gray-700 hover:bg-gray-300"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Hero Section with Proper Badminton Court */}
      <motion.section
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-32 overflow-hidden"
        style={{ y, opacity }}
      >
        {/* Proper Badminton Court */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/smashclash-background.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/60 to-purple-900/80" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 100 }}
              className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-green-500/30"
            >
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-medium">Smart Financial Management</span>
            </motion.div>

            <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                SmashBros
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
              >
                Ledger
              </motion.span>
            </h2>

            <motion.p
              className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              Revolutionary financial ledger system for the SmashBros badminton community. Track contributions, monitor
              expenses, and maintain complete transparency with smart analytics.
            </motion.p>

            <motion.div
              className="flex items-center justify-center gap-8 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Rs. {financialSummary.totalCollected.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Managed</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{members.length}</div>
                <div className="text-sm text-gray-400">Active Members</div>
              </div>
              <div className="w-px h-12 bg-gray-600" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Rs. {financialSummary.balanceInHand.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Available Balance</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto px-6 pb-16 space-y-12 -mt-12 relative z-20">
        {/* Financial Summary Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {/* Top Contributor Card */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 h-full shadow-2xl bg-gray-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Star className="w-5 h-5 text-yellow-100" />
                    <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-400/30">Top Contributor</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-1 text-white">{topContributor.name}</h3>
                  <p className="text-2xl font-bold text-yellow-100">Rs. {topContributor.totalAmount.toLocaleString()}</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Monthly Summary Card */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="border-0 shadow-xl h-full bg-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    This Month
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="text-left sm:text-start">
                      <p className="text-sm text-gray-400">Collection</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        Rs. {monthlyData.thisMonthCollection.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-400">Expenses</p>
                      <p className="text-xl sm:text-2xl font-bold text-red-600">
                        Rs. {monthlyData.thisMonthExpenses.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>


          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="border-0 shadow-xl h-full bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Collected</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    Rs. {financialSummary.totalCollected.toLocaleString()}
                  </div>
                  <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="border-0 shadow-xl h-full bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">Balance in Hand</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    Rs. {financialSummary.balanceInHand.toLocaleString()}
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Available funds</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Simplified Members Contribution Table */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-2xl bg-gray-800">
            <CardHeader className="border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    Member Contributions
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">May to December payment tracking</p>
                </div>
                <Badge variant="outline" className="text-gray-300 border-gray-700">
                  {members.length} Members
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-700 bg-gray-900/50">
                      <TableHead className="font-bold text-gray-300 py-4 px-6">Member</TableHead>
                      {months.map((month) => (
                        <TableHead key={month} className="font-bold text-gray-300 text-center min-w-[100px] py-4">
                          {month}
                        </TableHead>
                      ))}
                      <TableHead className="font-bold text-gray-300 text-center py-4 px-6">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member: any, index: number) => (
                      <motion.tr
                        key={member.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                        className="border-b border-gray-700 transition-all duration-200"
                      >
                        <TableCell className="font-semibold text-gray-300 py-4 px-6">{member.name}</TableCell>
                        {months.map((month) => {
                          const monthKey = month.toLowerCase() as keyof typeof member
                          const amount = member[monthKey] as number | null
                          return (
                            <TableCell key={month} className="text-center py-4">
                              {getPaymentStatusDisplay(amount, monthKey)}
                            </TableCell>
                          )
                        })}
                        <TableCell className="text-center font-bold py-4 px-6">
                          <div className="inline-flex items-center justify-center w-24 h-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-bold rounded-lg shadow-lg">
                            Rs. {member.total.toLocaleString()}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Expenses Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-2xl bg-gray-800">
            <CardHeader className="border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                    <Target className="w-6 h-6 text-red-500" />
                    Recent Expenses
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">Latest transactions with detailed information</p>
                </div>
                <Badge variant="outline" className="text-gray-300 border-gray-700">
                  {expenses.length} Transactions
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {expenses.map((expense: any, index: number) => {
                  const IconComponent = expense.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        y: -2,
                      }}
                      className="group relative bg-gray-900 rounded-xl border border-gray-700 p-4 sm:p-6 hover:border-gray-600 transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                          <motion.div
                            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </motion.div>
                          <div className="space-y-1 w-full">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-white text-base sm:text-lg">{expense.name}</h4>
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                {expense.category}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">{expense.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(expense.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <motion.p
                            className="text-xl sm:text-2xl font-bold text-white"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            Rs.&nbsp;{expense.amount.toLocaleString()}
                          </motion.p>
                          <p className="text-sm text-gray-500">Amount</p>
                        </div>
                      </div>
                    </motion.div>

                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>



        {/* Enhanced Sponsorship Section - Only show if sponsors exist */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-2xl bg-gray-800">
            <CardHeader className="border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                    <Gift className="w-6 h-6 text-purple-600" />
                    Sponsorship Partners
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">Organizations supporting SmashBros community</p>
                </div>
                <Badge variant="outline" className="text-purple-700 border-purple-300">
                  {sponsors.length} Active Sponsors
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sponsors?.map((sponsor: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                      boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                    }}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-white text-lg">{sponsor.name}</h4>
                      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                        <Gift className="w-5 h-5 text-purple-500" />
                      </motion.div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                        {new Date(sponsor.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>

                      <span className="text-xl font-bold text-purple-600">Rs. {sponsor.amount.toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sponsorship Call-to-Action Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-purple-900/50 via-pink-900/30 to-purple-900/50 rounded-2xl p-12 border-2 border-dashed border-purple-500/50 hover:border-purple-400/70 transition-all duration-300 text-center overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-purple-600/10 animate-pulse" />
            <div className="absolute top-4 right-4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl" />
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-pink-500/20 rounded-full blur-lg" />

            <div className="relative z-10">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
              >
                <Gift className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Become Our Sponsor! 🌟
              </h3>

              <p className="text-lg text-gray-300 mb-6 leading-relaxed max-w-md mx-auto">
                Join our amazing community and help us grow! Your sponsorship makes a real difference in our badminton
                journey.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-center gap-3 text-purple-300">
                  <Star className="w-5 h-5" />
                  <span className="text-sm font-medium">Brand Visibility & Recognition</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-purple-300">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">Community Partnership</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-purple-300">
                  <Trophy className="w-5 h-5" />
                  <span className="text-sm font-medium">Support Local Sports</span>
                </div>
              </div>

              <Dialog open={isSponsorDialogOpen} onOpenChange={setIsSponsorDialogOpen}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <Gift className="w-5 h-5" />
                    <span>Contact Us to Sponsor</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-lg bg-gray-800 border border-gray-600 rounded-xl text-white">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-white">
                      <Gift className="w-5 h-5 text-purple-400" />
                      Sponsorship Partnership
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    {/* Introduction */}
                    <div className="text-center space-y-3">
                      <h3 className="text-lg font-semibold text-white">Partner with SmashBros Badminton Community</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Join our growing badminton community and gain valuable brand exposure while supporting local
                        sports development.
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-white text-sm">Partnership Benefits:</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Star className="w-3 h-3 text-purple-400" />
                          <span>Brand Visibility</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Users className="w-3 h-3 text-purple-400" />
                          <span>Community Reach</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Trophy className="w-3 h-3 text-purple-400" />
                          <span>Sports Association</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Heart className="w-3 h-3 text-purple-400" />
                          <span>Social Impact</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-white text-sm">Get in Touch:</h4>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-white text-sm">Email</p>
                            <a
                              href="mailto:smashbrosplay6@gmail.com"
                              className="text-purple-400 text-sm hover:text-purple-300"
                            >
                              smashbrosplay6@gmail.com
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-white text-sm">Phone</p>
                            <a href="tel:+94713080226" className="text-purple-400 text-sm hover:text-purple-300">
                              (+94) 713080226
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-white text-sm">Website</p>
                            <a
                              href="https://smashbrosplay.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 text-sm hover:text-purple-300"
                            >
                              smashbrosplay.com
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-white text-sm">Available</p>
                            <p className="text-gray-300 text-sm">Mon-Sat: 7PM-9PM</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center pt-2">
                      <p className="text-sm text-gray-300">We'd love to discuss partnership opportunities with you.</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <p className="text-xs text-gray-500 mt-4">📧 smashbrosplay6@gmail.com | 📱 (+94) 713080226</p>
            </div>
          </motion.div>
        </motion.div>
      </div>



      {/* Professional Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
        className="bg-gray-900 border-t border-gray-700 py-12 mt-16"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                {/* <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center p-2">
                  <Image
                    src="/smashbros-logo.png"
                    alt="SmashBros Logo"
                    width={24}
                    height={24}
                    className="object-contain filter invert"
                  />
                </div> */}
                <div>
                  <h3 className="text-xl font-bold text-white">SmashBros.</h3>
                  <p className="text-sm text-gray-400">Ledger</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Revolutionary ledger system for the SmashBros badminton community. Transparent, efficient, and smart
                financial management for modern sports clubs.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 smashbrosplay6@gmail.com</li>
                <li>📱 (+94) 713080226</li>
                <li>🕒 Mon-Sat: 7PM-9PM</li>
                <li>🌐 smashbrosplay.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 SmashLedger by SmashBros. All rights reserved. | Designed for transparency and excellence.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
