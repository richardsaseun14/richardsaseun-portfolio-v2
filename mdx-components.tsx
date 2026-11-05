import type { MDXComponents } from "mdx/types";
import { Chapter } from "@/components/case-study/Chapter";
import { Summary } from "@/components/case-study/Summary";
import { Stats, Stat } from "@/components/case-study/Stats";
import { Figure, FigurePair, MobileGallery } from "@/components/case-study/Figure";
import {
  Problem,
  ProblemList,
  Decision,
} from "@/components/case-study/Decision";
import {
  Architecture,
  Callout,
  CodeBlock,
  Metrics,
  StackTable,
} from "@/components/case-study/Technical";
import { Credits, Lessons, Timeline } from "@/components/case-study/Process";
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Chapter,
    Summary,
    Stats,
    Stat,
    Figure,
    FigurePair,
    MobileGallery,
    Problem,
    ProblemList,
    Decision,
    Architecture,
    Callout,
    CodeBlock,
    Metrics,
    StackTable,
    Credits,
    Lessons,
    Timeline,
    ...components,
  };
}
