-- Join select
SELECT challenge_key, challenge_activity, challenge_type, challenge_status, completed, color_name, color_hex_code
FROM challenges 
JOIN colors ON (color_id = card_color);