"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Wallet, Plus, Trash2 } from "lucide-react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { fetchCoins } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function PortfolioPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [manualAssets, setManualAssets] = useState([])
  const [newAsset, setNewAsset] = useState({ coin: "", amount: "" })
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const { data: coins, isLoading: isLoadingCoins } = useQuery({
    queryKey: ["coins"],
    queryFn: fetchCoins,
  })

  useEffect(() => {
    // Load manual assets from localStorage
    const savedAssets = localStorage.getItem("manualAssets")
    if (savedAssets) {
      setManualAssets(JSON.parse(savedAssets))
    }

    // Check if wallet is connected
    checkWalletConnection()
  }, [])

  useEffect(() => {
    // Save manual assets to localStorage when they change
    localStorage.setItem("manualAssets", JSON.stringify(manualAssets))
  }, [manualAssets])

  const checkWalletConnection = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()

        if (accounts.length > 0) {
          setIsConnected(true)
          setWalletAddress(accounts[0].address)
        } else {
          setIsConnected(false)
          setWalletAddress("")
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error)
      setIsConnected(false)
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask to use this feature",
        variant: "destructive",
      })
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])

      if (accounts.length > 0) {
        setIsConnected(true)
        setWalletAddress(accounts[0])
        toast({
          title: "Wallet connected",
          description: "Your wallet has been connected successfully",
        })
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  const addManualAsset = () => {
    if (
      !newAsset.coin ||
      !newAsset.amount ||
      isNaN(Number.parseFloat(newAsset.amount))
    ) {
      toast({
        title: "Invalid input",
        description: "Please select a coin and enter a valid amount",
        variant: "destructive",
      })
      return
    }

    const selectedCoin = coins.find((c) => c.id === newAsset.coin)
    if (!selectedCoin) return

    const asset = {
      id: selectedCoin.id,
      name: selectedCoin.name,
      symbol: selectedCoin.symbol,
      image: selectedCoin.image,
      amount: Number.parseFloat(newAsset.amount),
      price: selectedCoin.current_price,
      value: Number.parseFloat(newAsset.amount) * selectedCoin.current_price,
    }

    setManualAssets([...manualAssets, asset])
    setNewAsset({ coin: "", amount: "" })
    setDialogOpen(false)

    toast({
      title: "Asset added",
      description: `${
        asset.amount
      } ${asset.symbol.toUpperCase()} has been added to your portfolio`,
    })
  }

  const removeManualAsset = (index) => {
    const updatedAssets = [...manualAssets]
    updatedAssets.splice(index, 1)
    setManualAssets(updatedAssets)

    toast({
      title: "Asset removed",
      description: "The asset has been removed from your portfolio",
    })
  }

  const getTotalPortfolioValue = () => {
    return manualAssets.reduce((total, asset) => total + asset.value, 0)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Portfolio Tracker</h1>

      {!isConnected ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your Ethereum wallet to automatically track your assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={connectWallet} className="gap-2">
              <Wallet className="h-4 w-4" />
              Connect MetaMask
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Connected Wallet</CardTitle>
            <CardDescription>Your Ethereum wallet is connected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-sm mb-4">{walletAddress}</div>
            {/* Wallet assets would be displayed here */}
            <div className="text-muted-foreground text-sm">
              Wallet integration is in progress. Manual tracking is available
              below.
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Assets</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Asset</DialogTitle>
              <DialogDescription>
                Add a cryptocurrency to your portfolio manually
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="coin">Cryptocurrency</Label>
                <select
                  id="coin"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newAsset.coin}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, coin: e.target.value })
                  }
                >
                  <option value="">Select a cryptocurrency</option>
                  {!isLoadingCoins &&
                    coins?.map((coin) => (
                      <option key={coin.id} value={coin.id}>
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={newAsset.amount}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, amount: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addManualAsset}>Add Asset</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {manualAssets.length > 0 ? (
        <>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Total Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(getTotalPortfolioValue())}
              </div>
            </CardContent>
          </Card>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manualAssets.map((asset, index) => (
                  <TableRow key={`${asset.id}-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={asset.image || "/placeholder.svg"}
                          alt={asset.name}
                          className="w-6 h-6"
                        />
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {asset.symbol.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{asset.amount}</TableCell>
                    <TableCell>{formatCurrency(asset.price)}</TableCell>
                    <TableCell>{formatCurrency(asset.value)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeManualAsset(index)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center mb-4">
              <p className="text-muted-foreground">
                You haven't added any assets yet
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Asset
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
