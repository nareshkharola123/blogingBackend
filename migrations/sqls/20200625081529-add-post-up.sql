/* Replace with your SQL commands */
SET search_path TO lbstarter,public;

CREATE TABLE posts (
  id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  blog_category_id integer NOT NULL,
  title varchar(500)  NOT NULL ,
  image_url varchar(200),
  created_on           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	modified_on          timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	deleted              bool DEFAULT false NOT NULL ,
  CONSTRAINT pk_posts_id PRIMARY KEY ( id ),
  constraint fk_posts_blog_categories
     foreign key (blog_category_id)
     REFERENCES blog_categories (id)
);
CREATE INDEX idx_posts ON posts ( title );
