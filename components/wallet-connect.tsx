"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Wallet, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export function WalletConnect() {
  const [account, setAccount] = useState("")
  const [balance, setBalance] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if already connected
    checkConnection()

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          getBalance(accounts[0])
        } else {
          setAccount("")
          setBalance("")
        }
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners()
      }
    }
  }, [])

  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()

        if (accounts.length > 0) {
          setAccount(accounts[0].address)
          getBalance(accounts[0].address)
        }
      }
    } catch (error) {
      console.error("Error checking connection:", error)
    }
  }

  const getBalance = async (address) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(address)
        setBalance(ethers.formatEther(balance))
      }
    } catch (error) {
      console.error("Error getting balance:", error)
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
      setIsConnecting(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])

      if (accounts.length > 0) {
        setAccount(accounts[0])
        getBalance(accounts[0])
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
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount("")
    setBalance("")
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  if (!account) {
    return (
      <Button onClick={connectWallet} disabled={isConnecting} className="gap-2">
        <Wallet className="h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wallet className="h-4 w-4" />
          {formatAddress(account)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex flex-col items-start">
          <span className="text-xs text-muted-foreground">Address</span>
          <span className="font-mono text-xs">{account}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex flex-col items-start">
          <span className="text-xs text-muted-foreground">Balance</span>
          <span>{Number.parseFloat(balance).toFixed(4)} ETH</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnectWallet} className="text-red-500 gap-2">
          <LogOut className="h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

