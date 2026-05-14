import { Keyboard } from "@/app/components/Keyboard";
import { KEYCAP_TEXTTURES } from "@/slices/ColorChanger";
import { Stage, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type SceneProps = {
  selectedTextureId: string;
  // knobColor: string;
  onAnimationComplete: () => void;
};

export function Scene({
  selectedTextureId,
  // knobColor,
  onAnimationComplete,
}: SceneProps) {
  const texturePaths = KEYCAP_TEXTTURES.map((t) => t.path);
  const textures = useTexture(texturePaths);
  const keyboardRef = useRef<THREE.Group>(null);
  //  delay thay đổi màu(chủ đề) mỗi khi click
  const [currentTextureId, setCurrentTextureId] = useState(selectedTextureId);

  useGSAP(() => {
    // Animate the Keyboard
    if (!keyboardRef.current || selectedTextureId === currentTextureId) return;

    const mn = gsap.matchMedia();

    mn.add("(prefers-reduced-motion: no-preference", () => {
      const keyboard = keyboardRef.current;
      if (!keyboard) return;
      // time line
      const tl = gsap.timeline({
        // Tránh click đổi màu liên tục (+setIsAnimating ở index.ts)
        onComplete: () => {
          onAnimationComplete();
        },
      });

      tl.to(keyboard.position, {
        y: 0.3,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          setCurrentTextureId(selectedTextureId);
        },
      });
      tl.to(keyboard.position, {
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1,0.4)",
      });
    });
    // giảm animation
    mn.add("(prefers-reduced-motion: reduce", () => {
      setCurrentTextureId(selectedTextureId);
      onAnimationComplete();
    });
  }, [selectedTextureId, currentTextureId]);

  // lido sdụng usememo => Chỉ tạo lại material khi textures thay đổi Tránh re-render tốn tài nguyên (3D rất nặng)
  const materials = useMemo(() => {
    // Tạo material cho từng texture tạo map từ id → material
    const materialMap: { [key: string]: THREE.MeshStandardMaterial } = {};

    // màu của từng loại key cap
    KEYCAP_TEXTTURES.forEach((textureConfig, index) => {
      const texture = Array.isArray(textures) ? textures[index] : textures;

      if (texture) {
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        materialMap[textureConfig.id] = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.7,
        });
      }
    });
    return materialMap;
  }, [textures]);
  // useEffect(() => {
  //   // Mỗi khi selectedTextureId thay đổi, coi như "animation" bắt đầu và kết thúc
  //   // Nếu bạn có dùng GSAP hay hiệu ứng xoay, hãy gọi hàm này ở callback kết thúc của chúng
  //   if (selectedTextureId) {
  //     // Tạm thời gọi ngay để mở khóa nút bấm
  //     onAnimationComplete();
  //   }
  // }, [selectedTextureId, onAnimationComplete]);
  const currentKnobColor = KEYCAP_TEXTTURES.find(
    (t) => t.id === selectedTextureId,
  )?.knobColor;
  return (
    <Stage environment="city" intensity={0.05} shadows="contact">
      <group ref={keyboardRef}>
        <Keyboard
          keycapMaterial={materials[selectedTextureId]}
          knobColor={currentKnobColor}
        />
      </group>
    </Stage>
  );
}
