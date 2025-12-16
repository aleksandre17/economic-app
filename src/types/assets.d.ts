// src/types/public.d.ts
declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.jpeg' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    const src: string;
    export default src;
}

declare module '*.gif' {
    const src: string;
    export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

// ✅ Document imports
declare module '*.pdf' {
    const src: string;
    export default src;
}

declare module '*.doc' {
    const src: string;
    export default src;
}

declare module '*.docx' {
    const src: string;
    export default src;
}

// ✅ Font imports
declare module '*.woff' {
    const src: string;
    export default src;
}

declare module '*.woff2' {
    const src: string;
    export default src;
}

declare module '*.ttf' {
    const src: string;
    export default src;
}

declare module '*.otf' {
    const src: string;
    export default src;
}

// ✅ Data imports
declare module '*.json' {
    const value: any;
    export default value;
}