import { Suspense } from "react";
import TrackClient from "./TrackClient";

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="site-width py-16">Loading tracker…</div>}>
      <TrackClient />
    </Suspense>
  );
}
