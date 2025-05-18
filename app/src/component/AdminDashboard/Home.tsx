"use client"
import Card from "./home/card"
import { SquareSigma, DiamondPercent, ShieldCheck, CircleX  } from "lucide-react"
import React, { useState } from "react"
import AdminDashboard from "./home/ComplaintHistories"

export default function Home() {
  const [pass] = useState(true)
  return (
    <div className="bg-gray-100">
     <div className="flex flex-col sm:flex-row sm:gap-2 flex-wrap">
      <Card icon={SquareSigma} text="Total Exam" value="0" className="flex-1" />
      <Card icon={DiamondPercent} text="Average%" value="60" className="flex-1" />
      <Card icon={DiamondPercent} text="Average/20" value="12" className="flex-1" />
      <Card
        icon={pass ? ShieldCheck : CircleX}
        text={pass ? "Pass" : "Failed"}
        value="12"
        className="flex-1"
      />
      <Card icon={SquareSigma} text="Total Exam" value="0" className="flex-1" />
      <Card icon={DiamondPercent} text="Average%" value="60" className="flex-1" />
      <Card icon={DiamondPercent} text="Average/20" value="12" className="flex-1" />
      <Card
        icon={pass ? ShieldCheck : CircleX}
        text={pass ? "Pass" : "Failed"}
        value="12"
        className="flex-1"
      />
    </div>

      <AdminDashboard />
    </div>
  )
}
