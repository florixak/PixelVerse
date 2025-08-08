import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Plus, Users, Zap } from "lucide-react";
import TopicSuggestButton from "./topic/topic-suggest-button";
import { Badge } from "./ui/badge";

const POPULAR_TOPIC_IDEAS = [
  "8-bit Characters",
  "Pixel Landscapes",
  "Game Assets",
  "Animations",
  "Tutorials",
  "Character Design",
];

const GlobalEmptyContentState = async () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-2 border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className="mb-6 relative">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <Lightbulb className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">No Content Yet!</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            PixelVerse is just getting started! Be the first to suggest topics
            that will help organize and discover amazing pixel art content.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full max-w-2xl">
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-sm text-blue-900">
                Build Community
              </h3>
              <p className="text-xs text-blue-700 text-center">
                Help artists find their niche
              </p>
            </div>
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
              <Zap className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-green-900">
                Spark Inspiration
              </h3>
              <p className="text-xs text-green-700 text-center">
                Create themed challenges
              </p>
            </div>
            <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
              <Lightbulb className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="font-semibold text-sm text-purple-900">
                Shape the Platform
              </h3>
              <p className="text-xs text-purple-700 text-center">
                Be a founding contributor
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <TopicSuggestButton />
            <span className="text-sm text-muted-foreground">
              or wait for the community to grow
            </span>
          </div>

          <div className="mt-8 pt-6 border-t border-muted-foreground/20 w-full">
            <p className="text-sm text-muted-foreground mb-3">
              Popular topic ideas:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {POPULAR_TOPIC_IDEAS.map((topic) => (
                <Badge key={topic} className="bg-muted text-muted-foreground">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalEmptyContentState;
