/* Replace with your SQL commands */
UPDATE lbstarter.blog_categories
	SET title='blogCategory1'
	WHERE id=1;
UPDATE lbstarter.blog_categories
	SET title='blogCategory2'
	WHERE id=2;
UPDATE lbstarter.blog_categories
	SET title='blogCatgory4'
	WHERE id=4;

ALTER TABLE lbstarter.blog_categories
ADD CONSTRAINT title_unique UNIQUE (title);
