"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarDays, CheckCircle2, Clock, Headphones, MapPin, XCircle } from "lucide-react";

type Counselor = {
  id: string;
  name: string;
  title: string;
  experience: number;
  languages: string[];
  focus: string[];
  rating: number;
  location: string;
  availability: Array<{
    date: string;
    slots: string[];
  }>;
};

type BookingRequest = {
  id: string;
  counselorId: string;
  counselorName: string;
  date: string;
  slot: string;
  note?: string;
  status: "Pending" | "Approved" | "Rejected";
};

const counselors: Counselor[] = [
  {
    id: "c1",
    name: "Dr. Aditi Rao",
    title: "Career Psychologist",
    experience: 9,
    languages: ["English", "Hindi"],
    focus: ["STEM pathways", "Study planning", "Scholarships"],
    rating: 4.9,
    location: "Remote • IST",
    availability: [
      { date: "2025-11-24", slots: ["10:00 AM", "11:30 AM", "03:00 PM"] },
      { date: "2025-11-25", slots: ["09:30 AM", "01:00 PM", "04:30 PM"] },
    ],
  },
  {
    id: "c2",
    name: "Jonathan Blake",
    title: "University Counselor",
    experience: 12,
    languages: ["English"],
    focus: ["Business & Commerce", "International transfers", "Interview prep"],
    rating: 4.8,
    location: "Hybrid • GMT+1",
    availability: [
      { date: "2025-11-25", slots: ["08:30 AM", "10:30 AM", "02:00 PM"] },
      { date: "2025-11-26", slots: ["09:00 AM", "12:30 PM", "05:00 PM"] },
    ],
  },
  {
    id: "c3",
    name: "Dr. Leena Pillai",
    title: "Student Success Coach",
    experience: 7,
    languages: ["English", "Malayalam", "Tamil"],
    focus: ["Healthcare careers", "Soft skills coaching", "Gap year design"],
    rating: 4.7,
    location: "Remote • IST",
    availability: [
      { date: "2025-11-26", slots: ["10:00 AM", "12:00 PM", "06:00 PM"] },
      { date: "2025-11-27", slots: ["09:30 AM", "11:30 AM", "03:30 PM"] },
    ],
  },
];

export default function BookCounselorPage() {
  const [selectedCounselorId, setSelectedCounselorId] = useState<string>(counselors[0]?.id ?? "");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [requests, setRequests] = useState<BookingRequest[]>([
    {
      id: "req-1",
      counselorId: "c2",
      counselorName: "Jonathan Blake",
      date: "2025-11-18",
      slot: "02:00 PM",
      status: "Approved",
      note: "Discussing BBA vs Economics tracks.",
    },
    {
      id: "req-2",
      counselorId: "c1",
      counselorName: "Dr. Aditi Rao",
      date: "2025-11-20",
      slot: "11:30 AM",
      status: "Pending",
      note: "Need clarity on preferred engineering branches.",
    },
  ]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const selectedCounselor = useMemo(
    () => counselors.find((counselor) => counselor.id === selectedCounselorId),
    [selectedCounselorId]
  );

  const availableDates = selectedCounselor?.availability ?? [];
  const availableSlotsForSelectedDate =
    availableDates.find((option) => option.date === selectedDate)?.slots ?? [];

  const handleBookSlot = () => {
    if (!selectedCounselor || !selectedDate || !selectedSlot) {
      setFeedback({ type: "error", message: "Please choose a counselor, date, and slot to continue." });
      return;
    }
    const newRequest: BookingRequest = {
      id: `req-${Date.now()}`,
      counselorId: selectedCounselor.id,
      counselorName: selectedCounselor.name,
      date: selectedDate,
      slot: selectedSlot,
      status: "Pending",
      note: notes.trim() || undefined,
    };
    setRequests((prev) => [newRequest, ...prev]);
    setFeedback({
      type: "success",
      message: `Slot on ${newRequest.date} at ${newRequest.slot} is locked in as a pending request.`,
    });
    setNotes("");
    setSelectedSlot("");
    setSelectedDate("");
  };

  const updateRequestStatus = (id: string, status: BookingRequest["status"]) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container mx-auto px-6 space-y-10">
        <div className="rounded-3xl bg-white border border-teal-100 p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-teal-600">
            <Headphones className="h-6 w-6" />
            <p className="uppercase text-xs tracking-wide font-semibold">
              Guided career coaching
            </p>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Book a Counselor</h1>
          <p className="text-gray-600 max-w-3xl">
            You have completed the interests quiz! Choose a counselor, explore their upcoming slots,
            and send a booking request. Once a counselor confirms, you will receive the final meeting
            link by email. Until then, everything stays in your dashboard.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700">
              <Clock className="h-4 w-4" /> 45-min deep dive sessions
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600">
              <CalendarDays className="h-4 w-4" /> Slots refreshed every morning
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">
              <MapPin className="h-4 w-4" /> 100% remote & hybrid options
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-teal-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Pick an available slot</CardTitle>
              <p className="text-sm text-gray-600">
                Filter by counselor, then lock in the date and time that suits you.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Counselor</label>
                  <Select value={selectedCounselorId} onValueChange={(val) => {
                    setSelectedCounselorId(val);
                    setSelectedDate("");
                    setSelectedSlot("");
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select counselor" />
                    </SelectTrigger>
                    <SelectContent>
                      {counselors.map((counselor) => (
                        <SelectItem key={counselor.id} value={counselor.id}>
                          {counselor.name} • {counselor.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <Select
                    value={selectedDate}
                    onValueChange={(val) => {
                      setSelectedDate(val);
                      setSelectedSlot("");
                    }}
                    disabled={availableDates.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map((option) => (
                        <SelectItem key={option.date} value={option.date}>
                          {new Date(option.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Slot</label>
                  <Select
                    value={selectedSlot}
                    onValueChange={setSelectedSlot}
                    disabled={availableSlotsForSelectedDate.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlotsForSelectedDate.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">What should we prepare for?</label>
                <Textarea
                  placeholder="Example: Need help comparing engineering majors + want a 4-year roadmap."
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>

              {feedback && (
                <div
                  className={cn(
                    "rounded-lg border px-4 py-3 text-sm",
                    feedback.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  )}
                >
                  {feedback.message}
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Bookings stay pending until your counselor approves. Final call details arrive by email.
                </p>
                <Button onClick={handleBookSlot} className="px-6">
                  Lock this slot
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {counselors.map((counselor) => (
              <Card key={counselor.id} className={cn("border", counselor.id === selectedCounselorId ? "border-orange-300 shadow-md" : "border-gray-200")}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{counselor.name}</CardTitle>
                      <p className="text-sm text-gray-500">{counselor.title}</p>
                    </div>
                    <Badge variant="secondary">{counselor.rating.toFixed(1)} ★</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <p><span className="font-medium">Experience:</span> {counselor.experience}+ yrs</p>
                  <p><span className="font-medium">Languages:</span> {counselor.languages.join(", ")}</p>
                  <p><span className="font-medium">Focus:</span> {counselor.focus.join(" • ")}</p>
                  <p className="flex items-center gap-1 text-gray-500 text-xs uppercase tracking-wide">
                    <MapPin className="h-3.5 w-3.5" /> {counselor.location}
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    onClick={() => {
                      setSelectedCounselorId(counselor.id);
                      setSelectedDate("");
                      setSelectedSlot("");
                    }}
                  >
                    View slots
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border-indigo-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Your booking requests</CardTitle>
            <p className="text-sm text-gray-600">
              Track counselor responses. Approvals generate calendar invites automatically.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {requests.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-6">
                You have no requests yet. Book a slot to see it listed here.
              </div>
            )}
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-base font-semibold text-gray-800">{request.counselorName}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(request.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    • {request.slot}
                  </p>
                  {request.note && (
                    <p className="text-xs text-gray-500 mt-1">Note: {request.note}</p>
                  )}
                </div>
                <div className="flex flex-col items-start md:items-end gap-2">
                  <Badge
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-full",
                      request.status === "Pending" && "bg-amber-100 text-amber-800",
                      request.status === "Approved" && "bg-emerald-100 text-emerald-700",
                      request.status === "Rejected" && "bg-rose-100 text-rose-700"
                    )}
                  >
                    {request.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      onClick={() => updateRequestStatus(request.id, "Approved")}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => updateRequestStatus(request.id, "Rejected")}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

