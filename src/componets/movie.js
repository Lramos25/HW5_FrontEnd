
import { useParams } from 'react-router-dom';
import React, { Panel, useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsStarFill} from 'react-icons/bs'
import { useDispatch, useSelector } from "react-redux";
import { fetchMovie, newComment } from "../actions/movieActions";



const Movie = () => {
    const { movieId } = useParams();
    const selectedMovie = useSelector((state) => state.movie.selectedMovie);
    const dispatch = useDispatch();
    const [commentDetails, setCommentDetails] = useState({
        movie: selectedMovie?.title,
        reviewer: localStorage.getItem("username"),
        quote: "",
        rating: 0,
    });

    const handleChange = (event) => {
        setCommentDetails({
            ...commentDetails,
            [event.target.name]: event.target.value,
        });
        if (!commentDetails.movie) {
            setCommentDetails({
                movie: selectedMovie?.title,
                reviewer: localStorage.getItem("username"),
                quote: "",
                rating: 0,
            });
        }
    };

    useEffect(() => {
        dispatch(fetchMovie(movieId));
    }, [dispatch, movieId]);

    const ActorInfo = ({ actors }) => {
        if (!actors) {
            return null;
        }
        return actors?.map((actor, i) => (
            <p key={i}>
                <b>{actor.actorName}</b> {actor.characterName}
            </p>
        ));
    };

    const ReviewInfo = ({ reviews }) => {
        if (!reviews) {
            return null;
        }
        return reviews?.map((review, i) => (
            <p key={i}>
                <b>{review.reviewer}</b> {review.quote}
                <BsStarFill glyph={"star"} /> {review.rating}
            </p>
        ));
    };

    return (
        <Panel>
            {!selectedMovie ? (
                <div>...loading</div>
            ) : (
                <>
                    <Panel.Heading>Movie Detail</Panel.Heading>
                    <Panel.Body>
                        <Image className="image" src={selectedMovie.imageUrl} thumbnail />
                    </Panel.Body>
                    <ListGroup>
                        <ListGroupItem>{selectedMovie.title}</ListGroupItem>
                        <ListGroupItem>
                            <ActorInfo actors={selectedMovie.actors} />
                        </ListGroupItem>
                        <ListGroupItem>
                            <h4>
                                <BsStarFill glyph={"star"} /> {selectedMovie.avgRating}{" "}
                            </h4>
                        </ListGroupItem>
                    </ListGroup>
                    <Panel.Body>
                        <ReviewInfo reviews={selectedMovie.Reviews} />
                    </Panel.Body>
                    <form>
                        <label htmlFor="quote"> Review </label>
                        <input
                            name="quote"
                            onChange={handleChange}
                            value={commentDetails.quote}
                            type="text"
                            placeholder="Leave a review"
                        />
                        <label htmlFor="rating"> Rating </label>
                        <input
                            type="number"
                            placeholder="Leave a Rating"
                            min="0"
                            max="5"
                            name="rating"
                            value={commentDetails.rating}
                            onChange={handleChange}
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(newComment(commentDetails, selectedMovie._id));
                                setCommentDetails({
                                    movie: selectedMovie?.title,
                                    reviewer: localStorage.getItem("username"),
                                    quote: "",
                                    rating: 0,
                                });
                            }}
                        >
                            Submit Review
                        </button>
                    </form>
                </>
            )}
        </Panel>
    );
};

export default Movie;