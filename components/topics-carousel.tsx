import { Topic } from "@/sanity.types";
import Image from "next/image";

type TopicsCarouselProps = {
  topics?: Topic[];
  className?: string;
  showTitle?: boolean;
  title?: string;
};

const TopicsCarousel = ({
  topics = [],
  className = "",
}: TopicsCarouselProps) => {
  return (
    <div className={`topics-carousel ${className}`}>
      <div className="flex overflow-x-auto gap-4 p-4">
        {topics.map((topic) => (
          <div
            key={topic._id}
            className="border rounded-lg p-4 w-[20rem] overflow-hidden"
          >
            {topic.bannerUrl && (
              <Image
                src={topic.bannerUrl}
                alt={topic.title ? topic.title : "Topic Banner"}
                className="w-full object-cover rounded-lg"
              />
            )}
            <h2 className="text-xl font-bold mt-2">{topic.title}</h2>
            <p className="text-sm text-gray-600">{topic.description}</p>
            <a
              href={`/topics/${topic.slug}`}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View Topic
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicsCarousel;
