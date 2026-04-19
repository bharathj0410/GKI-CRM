import { addToast } from '@heroui/react';

export default function Toast(title,description,color) {
    addToast({
        title,
        description,
        color,
        variant: "flat",
        className:"light"
      });
}
