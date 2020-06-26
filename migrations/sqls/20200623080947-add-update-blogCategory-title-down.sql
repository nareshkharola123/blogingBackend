/* Replace with your SQL commands */
ALTER TABLE lbstarter.blog_categories
DROP CONSTRAINT title_unique;

UPDATE lbstarter.blog_categories
	SET title='blogCategory2'
	WHERE id=1;
UPDATE lbstarter.blog_categories
	SET title='blogCategory2'
	WHERE id=2;
UPDATE lbstarter.blog_categories
	SET title='blogCatgory2'
	WHERE id=4;
