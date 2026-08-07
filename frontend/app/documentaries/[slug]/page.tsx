import { documentaries } from "@/lib/documentaries";
import ChatWidget from "@/components/ChatWidget";
import { notFound } from "next/navigation";

// LEARNING NOTE: [slug] is a "dynamic route" - Next.js passes whatever is in
// the URL (e.g. /documentaries/sundarbans) into params.slug automatically.

export default function DocumentaryPage({ params }: { params: { slug: string } }) {
  const doc = documentaries.find((d) => d.slug === params.slug);

  if (!doc) {
    notFound(); // renders Next.js's built-in 404 page
  }

  return (
    <div>
      <div className="episode-tag">{doc!.episode}</div>
      <h1>{doc!.title}</h1>
      <p>{doc!.description}</p>
      <div className="episode-content">
        <p style={{ whiteSpace: "pre-wrap" }}>{doc!.body}</p>
      </div>

      {/* Chatbot scoped to this episode - ask questions about THIS documentary */}
      <ChatWidget documentaryTitle={doc!.title} />
    </div>
  );
}
