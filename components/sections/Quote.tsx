import React from "react";

interface QuoteProps {
  text: string;
  author: string;
}

const Quote: React.FC<QuoteProps> = ({ text, author }) => {
  return (
    <section id="quote" className="section-container section-bg">
		<div className="container">
			<figure className="text-center">
				<blockquote className="blockquote">
					<p>{text}</p>
				</blockquote>
				<figcaption className="blockquote-footer">
					<cite title="Source Title">{author}</cite>
				</figcaption>
			</figure>
		</div>
	</section>
  );
};

export default Quote;
