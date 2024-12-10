/*
 * @Author: zhangxuefeng
 * @Date: 2024-05-24 14:45:53
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-07-20 11:23:24
 * @Description:
 */
import React, { FC, useEffect, useState } from 'react';
import { Image } from 'antd';
import clsx from 'clsx';

interface CustomIconProps {
  type: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg';
}

export const CustomIcon: FC<CustomIconProps> = ({
  type,
  color = 'currentColor',
  className,
  style,
  size = 'md'
}) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const imageType = type.split('.').pop()?.toLowerCase();
  const imagePath = `/assets/menu/${type}`;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(imagePath);
        const svgText = await response.text();

        if (imageType === 'svg') {
          const colorizedSvg = svgText.replace(
            /(<svg[^>]*>)/g,
            `$1<style>*{fill:${color}}</style>`
          );
          setSvgContent(colorizedSvg);
        }
      } catch (error) {
        console.error('Error loading SVG:', error);
      }
    };

    if (imageType === 'svg') {
      loadSvg();
    }
  }, [imagePath, color, imageType]);

  const combinedClassName = clsx('inline-block', sizeClasses[size], className);

  if (imageType === 'svg' && svgContent) {
    return (
      <div
        className={combinedClassName}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style
        }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }

  return (
    <Image
      src={imagePath}
      className={combinedClassName}
      style={{
        objectFit: 'contain',
        ...style
      }}
      preview={false}
    />
  );
};
