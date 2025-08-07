// src/styles/globalStyles.ts
import { StyleSheet } from "react-native";
import { imageSizes, radius, spacing } from "./spacing";

export const globalStyles = StyleSheet.create({

    smallImage: {
        width: imageSizes.md,
        height: imageSizes.sm,
        paddingTop:spacing.sm,
        objectFit: 'cover',
       
    }
  
});
