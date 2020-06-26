/* Replace with your SQL commands */
SET search_path TO lbstarter,public;

ALTER TABLE blog_categories DROP CONSTRAINT fk_blog_categories_users;
DROP TABLE blog_categories;
