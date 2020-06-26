/* Replace with your SQL commands */
SET search_path TO lbstarter,public;

ALTER TABLE posts DROP CONSTRAINT fk_posts_blog_categories;
DROP TABLE posts;
