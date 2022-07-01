-- Update challenge rows conditionally
UPDATE challenges
SET
    card_color = (SELECT color_id FROM colors WHERE color_name = "berry red")
WHERE challenges.challenge_type = "education";

UPDATE challenges
SET
    card_color = (SELECT color_id FROM colors WHERE color_name = "red")
WHERE challenges.challenge_type = "recreational";

UPDATE challenges
SET
    card_color = (SELECT color_id FROM colors WHERE color_name = "orange")
WHERE challenges.challenge_type = "social";

UPDATE challenges
SET
    card_color = (SELECT color_id FROM colors WHERE color_name = "yellow")
WHERE challenges.challenge_type = "relaxation";