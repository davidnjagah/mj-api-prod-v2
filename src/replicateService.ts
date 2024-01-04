import Replicate from "replicate";
import { ReplicateConfigParam } from "./interfaces";

export class ReplicateService {

  constructor(defaults: ReplicateConfigParam) {
    const { replicatetoken } = defaults;
    
    const replicate = new Replicate({
      auth: replicatetoken,
    });
    
    this.replicate = replicate;
  }
  private replicate;

  async replicateHeadshot(template: {name: string, prompt: string, uri: string}, imageUrl: string) {
   let prediction = await this.replicate.deployments.predictions.create(
            "davidnjagah",
            "my-app-image-generator",
            {
                input: {
                  seed: 1,
                  steps: 8,
                  width: 1080,
                  prompt: template.prompt,
                  n_prompt: "ugly, bad hair, baggy, blurry",
                  face_image: imageUrl,
                  pose_image: template.uri,
                  num_samples: 1,
                  face_resemblance: 0.5,
                  pose_resemblance: 0.8,
                  face_expanding_bbox: 0.5
                }
              }
          );

        prediction = await this.replicate.wait(prediction);
        console.log(prediction.output);
        return prediction.output;
  }
}
