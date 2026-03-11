"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { timelineEvents } from "@/data/timelineEvents";

interface TimelineEventModalProps {
  eventId: string;
}

export function TimelineEventModal({ eventId }: TimelineEventModalProps) {
  const locale = useLocale() as "en" | "th";
  const event = timelineEvents.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Event not found</p>
      </div>
    );
  }

  const title = locale === "th" && event.titleTh ? event.titleTh : event.titleEn;
  const description =
    locale === "th" && event.descriptionTh ? event.descriptionTh : event.descriptionEn;
  const impact = locale === "th" && event.impactTh ? event.impactTh : event.impactEn;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{event.company}</span>
          <span>·</span>
          <span>{event.date}</span>
        </div>
      </div>

      {/* Full Description */}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="leading-relaxed">{description}</p>
      </div>

      {/* Impact */}
      {impact && (
        <div className="rounded-lg bg-muted/50 p-4 border border-border">
          <h3 className="text-sm font-semibold mb-2">
            {locale === "th" ? "ผลกระทบ" : "Impact"}
          </h3>
          <p className="text-sm leading-relaxed">{impact}</p>
        </div>
      )}

      {/* Technologies - All skills */}
      {event.skills.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">
            {locale === "th" ? "เทคโนโลยี" : "Technologies"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {event.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-sm rounded-md bg-muted border border-border text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Optional Media Links */}
      {event.mediaLinks && event.mediaLinks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">
            {locale === "th" ? "สื่อ" : "Media"}
          </h3>
          <div className="space-y-3">
            {event.mediaLinks.map((media, index) => {
              const caption =
                locale === "th" && media.captionTh ? media.captionTh : media.caption;

              return (
                <div key={index} className="rounded-lg border border-border overflow-hidden">
                  {media.type === "image" && (
                    <div>
                      <div className="relative w-full aspect-video">
                        <Image
                          src={media.url}
                          alt={caption || "Event media"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 768px"
                        />
                      </div>
                      {caption && (
                        <p className="p-3 text-sm text-muted-foreground bg-muted/30">
                          {caption}
                        </p>
                      )}
                    </div>
                  )}
                  {media.type === "link" && (
                    <a
                      href={media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm font-medium underline">{caption || media.url}</span>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
