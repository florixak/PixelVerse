import { Topic } from "@/lib/types";
import { cache } from "react";

export const getTopics = cache(
  async (count: number = dummyTopics.length): Promise<Topic[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dummyTopics.slice(0, count));
      }, 1000);
    });
  }
);

export const getPostsByTopic = cache(
  async (slug: string): Promise<Topic["posts"]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const topic = dummyTopics.find((topic) => topic.slug === slug);
        if (!topic) {
          resolve([]);
          return;
        }
        if (!topic.posts || topic.posts.length === 0) {
          resolve([]);
          return;
        }
        const sortedPosts = topic.posts.sort(
          (a, b) => b.lastModified.getTime() - a.lastModified.getTime()
        );

        resolve(sortedPosts);
      }, 1000);
    });
  }
);

const dummyTopics: Topic[] = [
  {
    title: "Undertale",
    slug: "undertale",
    createdAt: new Date("2023-10-01"),
    lastModified: new Date("2023-10-02"),
    posts: [
      {
        title: "The Magic of Undertale",
        slug: "the-magic-of-undertale",
        createdAt: new Date("2023-10-01"),
        lastModified: new Date("2023-10-02"),
        content:
          "Undertale is a unique RPG that subverts traditional gaming tropes.",
      },
      {
        title: "Character Analysis: Sans",
        slug: "character-analysis-sans",
        createdAt: new Date("2023-10-03"),
        lastModified: new Date("2023-10-04"),
        content:
          "Sans is one of the most beloved characters in Undertale, known for his humor and depth.",
      },
      {
        title: "Music of Undertale",
        slug: "music-of-undertale",
        createdAt: new Date("2023-10-05"),
        lastModified: new Date("2023-10-06"),
        content:
          "The soundtrack of Undertale is iconic, with tracks that resonate with players long after they finish the game.",
      },
    ],
  },
  {
    title: "Omori",
    slug: "omori",
    createdAt: new Date("2024-10-01"),
    lastModified: new Date("2024-28-04"),
    posts: [
      {
        title: "Exploring the World of Omori",
        slug: "exploring-the-world-of-omori",
        createdAt: new Date("2024-10-01"),
        lastModified: new Date("2024-10-02"),
        content:
          "Omori is a psychological horror RPG that delves into themes of mental health and friendship.",
      },
      {
        title: "Character Deep Dive: Omori",
        slug: "character-deep-dive-omori",
        createdAt: new Date("2024-10-03"),
        lastModified: new Date("2024-10-04"),
        content:
          "The character of Omori is complex, with layers that unfold as the game progresses.",
      },
      {
        title: "The Art Style of Omori",
        slug: "the-art-style-of-omori",
        createdAt: new Date("2024-10-05"),
        lastModified: new Date("2024-10-06"),
        content:
          "Omori's art style is distinctive, blending cute and creepy elements to create a unique atmosphere.",
      },
    ],
  },
  {
    title: "Hollow Knight",
    slug: "hollow-knight",
    createdAt: new Date("2023-09-15"),
    lastModified: new Date("2023-09-20"),
    posts: [
      {
        title: "The Lore of Hollow Knight",
        slug: "the-lore-of-hollow-knight",
        createdAt: new Date("2023-09-15"),
        lastModified: new Date("2023-09-16"),
        content:
          "Hollow Knight's lore is rich and intricate, with a world full of history and mystery.",
      },
      {
        title: "Gameplay Mechanics in Hollow Knight",
        slug: "gameplay-mechanics-in-hollow-knight",
        createdAt: new Date("2023-09-17"),
        lastModified: new Date("2023-09-18"),
        content:
          "The gameplay mechanics in Hollow Knight are tight and rewarding, making exploration a joy.",
      },
      {
        title: "Boss Battles in Hollow Knight",
        slug: "boss-battles-in-hollow-knight",
        createdAt: new Date("2023-09-19"),
        lastModified: new Date("2023-09-20"),
        content:
          "Hollow Knight features some of the most challenging and memorable boss battles in modern gaming.",
      },
    ],
  },
  {
    title: "Celeste",
    slug: "celeste",
    createdAt: new Date("2023-08-10"),
    lastModified: new Date("2023-08-12"),
    posts: [
      {
        title: "Climbing the Mountain: Celeste's Journey",
        slug: "climbing-the-mountain-celestes-journey",
        createdAt: new Date("2023-08-10"),
        lastModified: new Date("2023-08-11"),
        content:
          "Celeste is a platformer that tells a touching story of perseverance and self-discovery.",
      },
      {
        title: "The Challenges of Celeste",
        slug: "the-challenges-of-celeste",
        createdAt: new Date("2023-08-12"),
        lastModified: new Date("2023-08-13"),
        content:
          "The game features challenging levels that test your skills and patience.",
      },
      {
        title: "Music and Atmosphere in Celeste",
        slug: "music-and-atmosphere-in-celeste",
        createdAt: new Date("2023-08-14"),
        lastModified: new Date("2023-08-15"),
        content:
          "Celeste's soundtrack perfectly complements its emotional narrative and gameplay.",
      },
    ],
  },
  {
    title: "Stardew Valley",
    slug: "stardew-valley",
    createdAt: new Date("2023-07-05"),
    lastModified: new Date("2023-07-06"),
  },
  {
    title: "Terraria",
    slug: "terraria",
    createdAt: new Date("2023-06-20"),
    lastModified: new Date("2023-06-22"),
  },
];
