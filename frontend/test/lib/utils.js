

export function wait(ms)
{
    let d = new Date(), d2 = null;
    do { d2 = new Date(); } while( d2-d < ms );
}
