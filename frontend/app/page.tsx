import Link from "next/link";
import { documentaries } from "@/lib/documentaries";

export default function DocumentariesPage() {
  return (
    <div>
      <h1>All Documentaries</h1>
      {documentaries.map((doc) => (
        <Link key={doc.slug} href={`/documentaries/${doc.slug}`} className="card">
          <div className="episode-tag">{doc.episode}</div>
          <h2>{doc.title}</h2>
          <p>{doc.description}</p>
        </Link>
      ))}
    </div>
  );
}
