'use client';

import { useLocale } from 'next-intl';
import { timelineEvents } from '@/data/timelineEvents';
import { LocalizedText, getLocalizedData } from '@/components/shared/LocalizedText';
import { TechBadge } from '@/components/shared/TechBadge';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Building2, Briefcase, GraduationCap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';
import { timelineChapters } from '@/data/timelineChapters';

export function TimelineModal({ id }: { id: string }) {
  const locale = useLocale();
  const { close } = useModal();
  const event = timelineEvents.find((e) => e.id === id);

  if (!event) return <div className="p-8 text-center text-muted-foreground">Event not found</div>;

  const title = getLocalizedData(event, 'title', locale);
  const company = event.company;
  const description = getLocalizedData(event, 'description', locale);
  const impact = getLocalizedData(event, 'impact', locale);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'work': return <Briefcase className="w-5 h-5" />;
      case 'project': return <Briefcase className="w-5 h-5" />;
      case 'education': return <GraduationCap className="w-5 h-5" />;
      case 'achievement': return <Award className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  }

  const chapter = timelineChapters.find(c => c.id === event.chapterId);
  const chapterName = chapter ? getLocalizedData(chapter, 'title', locale) : '';

  return (
    <div className="flex flex-col h-full relative p-6 sm:p-8 lg:p-10">
      <DialogHeader className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {getTypeIcon(event.type)}
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">
               <LocalizedText en={chapter?.titleEn || ''} th={chapter?.titleTh || ''} />
            </div>
          </div>
        </div>

        <DialogTitle className="text-3xl sm:text-4xl font-bold text-foreground text-left text-balance mb-4">
          {title}
        </DialogTitle>
        
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-4 text-sm sm:text-base">
           <div className="flex items-center gap-1.5 font-medium">
             <Building2 className="w-4 h-4" />
             {company}
           </div>
           <div className="flex items-center gap-1.5 font-medium">
             <Calendar className="w-4 h-4" />
             {event.date}
           </div>
        </div>
      </DialogHeader>

      <div className="space-y-8 flex-grow">
        <div className="space-y-4">
           <h3 className="text-xl font-bold"><LocalizedText en="Context" th="บริบทและหน้าที่" /></h3>
           <p className="text-muted-foreground leading-relaxed md:text-lg">
             {description}
           </p>
        </div>

        {impact && (
          <div className="space-y-4 rounded-xl border-l-4 border-primary bg-primary/5 p-6 shadow-sm">
             <h3 className="text-lg font-bold text-primary"><LocalizedText en="Impact" th="ผลกระทบและผลลัพธ์" /></h3>
             <p className="font-medium text-muted-foreground text-base leading-relaxed">
               {impact}
             </p>
          </div>
        )}

        {event.skills && event.skills.length > 0 && (
          <div className="space-y-4">
             <h3 className="text-lg font-bold"><LocalizedText en="Skills Executed" th="ทักษะที่ใช้" /></h3>
             <div className="flex flex-wrap gap-2">
               {event.skills.map((skill) => (
                 <TechBadge key={skill} name={skill} />
               ))}
             </div>
          </div>
        )}
      </div>
      
      <div className="mt-12 pt-6 border-t border-border flex justify-end">
        <Button onClick={close} variant="default">
          <LocalizedText en="Close Narrative" th="ปิดการอ่าน" />
        </Button>
      </div>
    </div>
  );
}
