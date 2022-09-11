import React from "react";
import { AdeIpsumClient, IpsumRequest } from "@/client/proto/v1/adeipsum_grpc_web_pb";
import { ServiceUnavailable } from "@/client/error";

const baseState = () => ({ errors: {}, content: "", status: "idle" });

const adeIpsumClient = new AdeIpsumClient("http://localhost:50051", null, null);
export const useContent = (number_of_sentences) => {
  const [state, setState] = React.useState(baseState);

  React.useEffect(() => {
    if (typeof number_of_sentences === "undefined" || number_of_sentences < 1) {
      return setState(baseState);
    }

    setState((state) => ({ ...state, status: "loading" }));

    const request = new IpsumRequest();
    request.setNumberOfSentences(number_of_sentences);
    adeIpsumClient.generateIpsum(request, {}, (err, response) => {
      if (err) {
        // Hack so the error will hit the error boundary
        return setState(() => {
          throw new ServiceUnavailable(err.message || "Service Unavailable");
        });
      }

      if (response.hasErrors()) {
        return setState({ ...baseState(), status: "error", errors: response.getErrors().toObject() });
      }

      setState({ ...baseState(), content: response.getContent() });
    });
  }, [number_of_sentences]);

  return [state.status, state.content, state.errors];
};

export default useContent;
