-- Select all challenge types that repeat more than 1 time 
SELECT challenge_type, COUNT(challenge_type)
FROM challenges
GROUP BY challenge_type
HAVING count(challenge_type) > 1;