// /types/react-pdf.d.ts
import { ReactElement, ComponentType, ReactNode, CSSProperties } from "react";

// Tipe untuk style object @react-pdf/renderer
export interface PDFStyle extends CSSProperties {
  fontFamily?: string;
  fontSize?: number | string;
  fontWeight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  fontStyle?: "normal" | "italic" | "oblique";
  color?: string;
  textAlign?: "left" | "right" | "center" | "justify";
  lineHeight?: number | string;
  letterSpacing?: number | string;
  textDecoration?: "none" | "underline" | "line-through" | "overline";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  backgroundColor?: string;
  border?: string | number;
  borderWidth?: number | string;
  borderColor?: string;
  borderStyle?: "solid" | "dashed" | "dotted" | "none";
  borderRadius?: number | string;
  padding?: number | string;
  paddingTop?: number | string;
  paddingRight?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  margin?: number | string;
  marginTop?: number | string;
  marginRight?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  alignContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "stretch"
    | "space-between"
    | "space-around";
  flex?: number | string;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | string;
  position?: "relative" | "absolute" | "fixed";
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  opacity?: number;
  transform?: string;
  overflow?: "visible" | "hidden" | "scroll";
}

// Type untuk style object atau array of style objects
export type PDFStyleProp = PDFStyle | PDFStyle[];

// Interface untuk painter di Canvas
export interface Painter {
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ): void;
  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean
  ): void;
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
  rect(x: number, y: number, width: number, height: number): void;
  fill(): void;
  stroke(): void;
  closePath(): void;
  beginPath(): void;
  save(): void;
  restore(): void;
  translate(x: number, y: number): void;
  rotate(angle: number): void;
  scale(x: number, y: number): void;
  transform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ): void;
  setTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ): void;
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  lineCap: "butt" | "round" | "square";
  lineJoin: "miter" | "round" | "bevel";
  miterLimit: number;
  font: string;
  textAlign: "start" | "end" | "left" | "right" | "center";
  textBaseline:
    | "top"
    | "hanging"
    | "middle"
    | "alphabetic"
    | "ideographic"
    | "bottom";
  fillText(text: string, x: number, y: number, maxWidth?: number): void;
  strokeText(text: string, x: number, y: number, maxWidth?: number): void;
  measureText(text: string): TextMetrics;
}

declare module "@react-pdf/renderer" {
  export interface DocumentProps {
    children?: ReactNode;
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    language?: string;
    pdfVersion?: string;
    onRender?: () => void;
  }

  export interface PageProps {
    children?: ReactNode;
    size?:
      | "A0"
      | "A1"
      | "A2"
      | "A3"
      | "A4"
      | "A5"
      | "A6"
      | "B0"
      | "B1"
      | "B2"
      | "B3"
      | "B4"
      | "B5"
      | "B6"
      | "C0"
      | "C1"
      | "C2"
      | "C3"
      | "C4"
      | "C5"
      | "C6"
      | "LETTER"
      | "LEGAL"
      | "EXECUTIVE"
      | "TABLOID"
      | [number, number];
    orientation?: "portrait" | "landscape";
    style?: PDFStyleProp;
    wrap?: boolean;
    debug?: boolean;
  }

  export interface TextProps {
    children?: ReactNode;
    style?: PDFStyleProp;
    wrap?: boolean;
    debug?: boolean;
    fixed?: boolean;
    hyphenationCallback?: (word: string) => string[];
  }

  export interface ViewProps {
    children?: ReactNode;
    style?: PDFStyleProp;
    wrap?: boolean;
    debug?: boolean;
    fixed?: boolean;
  }

  export interface ImageProps {
    src: string | { data: Uint8Array; format: "png" | "jpg" };
    style?: PDFStyleProp;
    debug?: boolean;
    cache?: boolean;
  }

  export interface LinkProps {
    src: string;
    style?: PDFStyleProp;
  }

  export interface NoteProps {
    children?: string;
    style?: PDFStyleProp;
  }

  export interface CanvasProps {
    style?: PDFStyleProp;
    paint: (painter: Painter) => void;
  }

  export interface StyleSheet {
    create: <T extends Record<string, PDFStyle>>(styles: T) => T;
  }

  export interface Font {
    register: (options: {
      family: string;
      src: string;
      fontStyle?: "normal" | "italic";
      fontWeight?: number | string;
    }) => void;
    getRegisteredFonts: () => Array<{
      family: string;
      sources: Array<{
        src: string;
        fontStyle?: string;
        fontWeight?: string | number;
      }>;
    }>;
  }

  export interface PDFViewerProps {
    children?: ReactNode;
    width?: number | string;
    height?: number | string;
    style?: PDFStyleProp;
    className?: string;
  }

  export interface PDFDownloadLinkProps {
    children?: ReactNode;
    document: ReactElement<DocumentProps>;
    fileName?: string;
    style?: PDFStyleProp;
    className?: string;
  }

  // Komponen-komponen utama
  export const Document: ComponentType<DocumentProps>;
  export const Page: ComponentType<PageProps>;
  export const Text: ComponentType<TextProps>;
  export const View: ComponentType<ViewProps>;
  export const Image: ComponentType<ImageProps>;
  export const Link: ComponentType<LinkProps>;
  export const Note: ComponentType<NoteProps>;
  export const Canvas: ComponentType<CanvasProps>;
  export const PDFViewer: ComponentType<PDFViewerProps>;
  export const PDFDownloadLink: ComponentType<PDFDownloadLinkProps>;

  // Utilities
  export const StyleSheet: StyleSheet;
  export const Font: Font;

  // Types untuk PDF generation
  export interface PDFOptions {
    pdfVersion?: string;
    language?: string;
  }

  export interface PDFInstance {
    toBlob: () => Promise<Blob>;
    toBuffer: () => Promise<Buffer>;
    toString: () => Promise<string>;
    toStream: () => NodeJS.ReadableStream;
  }

  // Fungsi utama
  export function pdf(
    element: ReactElement<DocumentProps>,
    options?: PDFOptions
  ): PDFInstance;

  // Hooks
  export function usePDF(options?: {
    document?: ReactElement<DocumentProps>;
  }): [
    {
      url: string | null;
      blob: Blob | null;
      error: Error | null;
      loading: boolean;
    },
    () => void
  ];

  // Font utilities
  export function registerFont(
    family: string,
    src: string,
    options?: {
      fontStyle?: "normal" | "italic";
      fontWeight?: number | string;
    }
  ): void;

  // Blob utilities
  export function BlobProvider(props: {
    document: ReactElement<DocumentProps>;
    children: (params: {
      url: string | null;
      blob: Blob | null;
      loading: boolean;
      error: Error | null;
    }) => ReactNode;
  }): ReactElement;
}
