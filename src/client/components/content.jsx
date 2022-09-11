import React from "react";
import PropTypes from "prop-types";
import useContent from "@/client/hooks/use-content";

const ContentError = ({ errors }) => {
  console.log({ errors });

  return (
    <div className="alert alert-danger d-flex" role="alert">
      <div className="m-auto">
        <h4>{errors.summary}</h4>
        <ul>
          {errors.fieldViolationsList.map((fieldViolation, index) => {
            return <li key={index}>{fieldViolation.description}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

ContentError.propTypes = {
  errors: PropTypes.shape({
    summary: PropTypes.string,
    fieldViolationsList: PropTypes.arrayOf(
      PropTypes.shape({
        field: PropTypes.string,
        description: PropTypes.string,
      })
    ),
  }).isRequired,
};

export const Content = ({ number }) => {
  const [status, content, errors] = useContent(number);
  if (status === "error") {
    return <ContentError errors={errors} />;
  }

  return <p>{content}</p>;
};

Content.propTypes = {
  number: PropTypes.number.isRequired,
};

export default Content;
