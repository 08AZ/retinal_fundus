"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Eye, Download, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample data for historical diagnoses
type Diagnosis = {
  id: number;
  date: string;
  time: string;
  image: string;
  diagnosis: string;
  confidence: number;
  left_or_right: string;
  status: string;
};
const sampleDiagnoses = [
  // ... your sample data here
]

export default function HistoricalDiagnoses() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("All")
  const [Diagnoses, setDiagnoses] = useState<Diagnosis[]>([])

  // Define async function to fetch diagnoses
  const fetchDiagnoses = async () => {
    try {
      const headers: HeadersInit = {};
      const csrfToken = localStorage.getItem("csrfToken");
      if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
        headers["Accept"] = "application/json"

        const user_id = localStorage.getItem("user_id");
        const response = await fetch("http://localhost:8000/diagnoses/", {
          body: JSON.stringify({ user_id: user_id }),
          method: "POST",
          headers: headers,
          credentials: "include"
        })
        const diagnoses = await response.json();
        setDiagnoses(diagnoses);
        console.log(diagnoses);
      }
    } catch (error) {
      console.error(error)
    }
  };

  // Call fetchDiagnoses in useEffect
  useEffect(() => {
    fetchDiagnoses();
  }, []);

  // Filter diagnoses based on search term and filter
  const filteredDiagnoses = Diagnoses.filter((diagnosis) => {
    const matchesSearch = diagnosis.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "All" || diagnosis.status === filter
    return matchesSearch && matchesFilter
  });

  return (
    <div className="w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Your UI code here */}
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {filteredDiagnoses.length > 0 ? (
          filteredDiagnoses.map((diagnosis, index) => (
            <motion.div
              key={diagnosis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-black/50 border-purple-500/30 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-64 h-48 md:h-auto">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 z-10"/>
                      <img
                        src={diagnosis.image || "/placeholder.svg"}
                        alt={`Retinal scan for ${diagnosis.diagnosis}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-6 flex-1">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{diagnosis.diagnosis}</h3>
                          <div className="flex items-center text-gray-400 text-sm mb-2">
                            <Calendar className="mr-2 h-4 w-4"/>
                            {diagnosis.date}
                            <Clock className="ml-4 mr-2 h-4 w-4"/>
                            {diagnosis.time}
                          </div>
                        </div>

                        <Badge
                          className={`${
                            diagnosis.status === "Confirmed" ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"
                          } self-start md:self-center mt-2 md:mt-0`}
                        >
                          {diagnosis.status}
                        </Badge>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">AI Confidence</span>
                          <span className="text-white text-sm">{(diagnosis.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            style={{ width: `${diagnosis.confidence * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-purple-500/20 text-purple-300">{diagnosis.left_or_right}</Badge>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="border-purple-500/30 text-white">
                          <Eye className="mr-2 h-4 w-4"/>
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-500/30 text-white">
                          <Download className="mr-2 h-4 w-4"/>
                          Download Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No diagnoses found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
