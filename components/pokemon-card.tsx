"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

interface PokemonCardProps {
  name: string;
  url: string;
}

interface PokemonDetails {
  id: number;
  types: Array<{ type: { name: string } }>;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
}

const typeColors: { [key: string]: string } = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-700",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

export default function PokemonCard({ name, url }: PokemonCardProps) {
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error("Error fetching Pokemon details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [url]);

  if (loading || !details) {
    return (
      <Card className="p-4 space-y-4 animate-pulse">
        <div className="w-full h-48 bg-gray-200 rounded-lg" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
      </Card>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-sm">
          <div className="relative w-full aspect-square mb-4">
            <Image
              src={details.sprites.other["official-artwork"].front_default}
              alt={name}
              fill
              className="object-contain p-4"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold capitalize text-center">
              {name}
            </h2>
            <div className="flex gap-2 justify-center">
              {details.types.map(({ type }) => (
                <Badge
                  key={type.name}
                  className={`${typeColors[type.name]} text-white`}
                >
                  {type.name}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold capitalize text-center">
            {name} #{details.id.toString().padStart(3, "0")}
          </DialogTitle>
        </DialogHeader>
        <div className="relative w-full aspect-square mb-4">
          <Image
            src={details.sprites.other["official-artwork"].front_default}
            alt={name}
            fill
            className="object-contain p-4"
          />
        </div>
        <div className="space-y-4">
          <div className="flex gap-2 justify-center">
            {details.types.map(({ type }) => (
              <Badge
                key={type.name}
                className={`${typeColors[type.name]} text-white`}
              >
                {type.name}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500">Height</p>
              <p className="font-semibold">{details.height / 10}m</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Weight</p>
              <p className="font-semibold">{details.weight / 10}kg</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Base Stats</h3>
            {details.stats.map((stat) => (
              <div key={stat.stat.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{stat.stat.name}</span>
                  <span className="font-semibold">{stat.base_stat}</span>
                </div>
                <Progress
                  value={(stat.base_stat / 255) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}