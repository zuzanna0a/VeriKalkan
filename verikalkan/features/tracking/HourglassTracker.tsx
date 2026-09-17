export default function HourglassTracker({ daysLeft, companyName }: { daysLeft: number, companyName: string }) {
  return <div>{companyName} — {daysLeft} gün kaldı</div>;
}
