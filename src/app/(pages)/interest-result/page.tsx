import { InterestResult } from "@/components/interest/interest-result";
import { InterestsMean } from "@/components/interest/interests-mean";

export default function InterestResultPage() {
  return (
    <div className="min-h-screen  py-12">
      <div className="container mx-auto px-6 space-y-12">
        {/* Interest Result Component */}
        <InterestResult />
        
        {/* Interests Mean Component */}
        <InterestsMean />
      </div>
    </div>
  );
}
