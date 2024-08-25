import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import Image from "next/image"

const items = [
  {
    title: "Real-time counselling data",
    description: "View the latest KCET counselling results by entering your rank/CET No or college name.",
    header: <Image src="/candidate-data.png" alt="Real-time Updates" width={500} height={500} className="rounded-lg border-2 border-gray-300" />,
    icon: IconArrowWaveRightUp,
  },
  {
    title: "Rank Analysis",
    description: "View detailed breakdowns of rank distributions across colleges and courses.",
    header: <Image src="/cutoffs.png" alt="Real-time Updates" width={500} height={100} className="rounded-lg border-2 border-gray-300" />,
    icon: IconTableColumn,
  },
  {
    title: "Option Entry",
    description: "Enter your options and view cutoff ranks for your preferred colleges.",
    header: <Image src="/option-entry.png" alt="Real-time Updates" width={500} height={100} className="rounded-lg border-2 border-gray-300" />,
    icon: IconBoxAlignRightFilled,
  },
  {
    title: "Personalized Recommendations",
    description: "Get tailored college and course suggestions based on your rank and preferences.",
    header: <Image src="/profile.png" alt="Real-time Updates" width={300} height={100} className="rounded-lg border-2 border-gray-300" />,
    icon: IconSignature,
    className: "",
  },
  {
    title: "Historical Cutoff Data",
    description: "Access past years' counselling data to identify trends and make informed decisions.",
    header: <Image src="/cutoffs.png" alt="Real-time Updates" width={500} height={100} className="rounded-lg border-2 border-gray-300" />,
    icon: IconClipboardCopy,
  },
  {
    title: "Chatrooms",
    description: "Join chatrooms to discuss your options and get advice from other users.",
    header: <Image src="/chatrooms.png" alt="Real-time Updates" width={500} height={100} className="rounded-lg border-2 border-gray-300" />,
    icon: IconBoxAlignTopLeft,
  },
];

export function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-6xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className + " rounded-lg border-2 border-gray-300"} 
        />
      ))}
    </BentoGrid>
  );
}