import React, {useEffect, useRef, useState} from "react";
import g from "./GridEffect.module.css";
import {useResizeDetector} from 'react-resize-detector';
import {circleAnimation, randomColor, solveRadiusCircle} from "./Draw";

//---------------------------------------------------------interface
interface IPosition {
    x1: number | null,
    y1: number | null,
    x2: number | null,
    y2: number | null,
}

interface ICircle {
    position: IPosition,
    id: number,
    anim: boolean,
    color: string,
    r: number
}
export let pixelSize = 50;


let getCursorPosition = (canvas: HTMLCanvasElement, e: any): { x: number, y: number } => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / rect.width * canvas.width);
    const y = Math.floor((e.clientY - rect.top) / rect.height * canvas.height);
    return {x: x, y: y}
}

//------------------------------------------------------------COMPONENT
const GridEffect: React.FC = () => {


    let circleRef = useRef<ICircle[]>([])
    let canvasRef = useRef<HTMLCanvasElement>(null);
    let requestIdRef = useRef<number>(0);

    let {width, height} = useResizeDetector({targetRef: canvasRef});


    if (canvasRef.current !== null && width !== undefined && height !== undefined) {
        width = Math.floor(width/pixelSize)
        height = Math.floor(height/pixelSize)
        if (Math.abs(width - canvasRef.current.width) > 100 || Math.abs(height - canvasRef.current.height) > 100) {
            canvasRef.current.width = width
            canvasRef.current.height = height
        }
    }

    let circleFrame = () => {
        if (canvasRef.current !== null) {
            let canvas = canvasRef.current;
            let ctx = canvas.getContext('2d');

            if (ctx !== null) {
                if (circleRef.current !== null) {
                    circleRef.current.forEach(c => {
                        if (c.position.x2 && c.position.y2) {
                            if (ctx !== null) {
                                if (c.anim) {
                                    circleAnimation(ctx, c.position.x2, c.position.y2, c.color, c.r);
                                } else {
                                    circleRef.current = circleRef.current.filter(f => {
                                        if (f.anim) return f
                                    })
                                }

                            }
                        }

                    })

                }
            } else {
                console.log('NULLLL ctx')
            }
        }
    }

    let updateCircle = () => {
        if (circleRef.current !== null) {
            circleRef.current.forEach(o => {
                if (o.r < solveRadiusCircle()) {
                    o.r += 6/pixelSize
                } else {
                    o.anim = false;
                }
            })

        }
    }

    const tick = () => {
        if (!canvasRef.current) return;
        circleFrame();
        updateCircle();
        requestIdRef.current = requestAnimationFrame(tick);
    }

    useEffect(() => {
        requestIdRef.current = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(requestIdRef.current);
        };
    }, []);


    return (
        <div>
            <canvas ref={canvasRef} className={g.canvas}
                    onClick={(e) => {
                        let position = getCursorPosition(e.target as HTMLCanvasElement, e);
                        circleRef.current.push({
                            id: new Date().getMilliseconds(),
                            r: 1,
                            anim: true,
                            color: randomColor(),
                            position: {x1: null, y1: null, x2: position.x, y2: position.y}
                        })
                    }}
            >
            </canvas>
        </div>
    )
};

export {GridEffect};
